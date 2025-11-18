const { where } = require("sequelize");
const { Op } = require("sequelize");
const { sequelize, Sequelize } = require("../models/db");

const initModels = require('../models/init-models');
const models = initModels(sequelize, Sequelize.DataTypes);

// const sessoes = require("../models/sessoes")(sequelize, Sequelize.DataTypes);
// const filmes = require("../models/filmes")(sequelize, Sequelize.DataTypes);
// const salas = require("../models/salas")(sequelize, Sequelize.DataTypes);
// const generos = require("../models/generos")(sequelize, Sequelize.DataTypes);
// const salasTipo = require("../models/salasTipo")(sequelize, Sequelize.DataTypes);

// token
const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';


exports.criarSessao = async (req, res) => {
    console.log('criando sessao');
    const authHeader = req.headers.authorization;
    const { idFilme, idSala, idSalasTipo, hora, data } = req.body;

    try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


        const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ erro: 'token inválido ou expirado' });
            }

            console.log(decoded);
            return decoded;
        });

        console.log('gestor:', autenticado);



        const sessaoExistente = await models.sessoes.findOne({
            where: {
                idFilme: idFilme,
                idSala: idSala,
                hora: hora,
                data: data
            }
        });

        console.log('sessaoExistente:', sessaoExistente);

        if (sessaoExistente) {
            return res.status(400).json({ erro: 'Sessão já existe para o filme, sala, hora e data informados.' });
        }



        const novaSessao = await models.sessoes.create({
            idFilme: idFilme,
            idSala: idSala,
            idSalasTipo: idSalasTipo,
            hora: hora,
            data: data
        });
        console.log('novaSessao:', novaSessao);

        if (!novaSessao) {
            return res.status(500).json({ erro: 'Erro ao criar sessão.' });
        }

        const sessaoComTudo = await models.sessoes.findOne({
            where: { idSessao: novaSessao.idSessao },
            include: [
                {
                    model: models.filmes,
                    as: 'idFilme_filme',
                    attributes: [
                        'titulo',
                        'duracao',
                        'idioma'
                    ],
                    include: [
                        {
                            model: models.generos,
                            as: 'idGenero_genero',
                            attributes: [
                                'nome',
                                'classificacao'
                            ]
                        }
                    ]
                },
                {
                    model: models.salas,
                    as: 'idSala_sala',
                    attributes: [
                        'numero'
                    ],
                    include: [
                        {
                            model: models.salasTipo,
                            as: 'ideSala_salasTipo',
                            attributes: [
                                'tipo',
                                'valor'
                            ]

                        }
                    ]
                },
                {
                    model: models.salasTipo,
                    as: 'idSalasTipo_salasTipo',
                    attributes: [
                        'tipo',
                        'valor'
                    ]
                }
            ]
        });

        // evitando o date para não pegar fuso
        const [ano, mes, dia] = sessaoComTudo.data.split('-');

        const meses = [
            'janeiro',
            'fevereiro',
            'março',
            'abril',
            'maio',
            'junho',
            'julho',
            'agosto',
            'setembro',
            'outubro',
            'novembro',
            'dezembro'
        ];

        const sessaoFormatada = {
            ...sessaoComTudo.toJSON(),
            data: `${dia.padStart(2, '0')} de ${meses[Number(mes) - 1]} de ${ano}`
        };

        res.status(201).json({
            mensagem: 'Sessão criada com sucesso',
            sessao: sessaoFormatada
        });
    } catch (error) {
        console.error('Erro ao criar sessão:', error);
    }
}


exports.editarSessao = async (req, res) => {
    const authHeader = req.headers.authorization;
    const { idSessao, idFilme, idSala, hora, data, status } = req.body;

    try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


        const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ erro: 'token inválido ou expirado' });
            }

            console.log(decoded);
            return decoded;
        });

        console.log('gestor:', autenticado);

        // Busca a sessão pelo idSessao
        const sessao = await models.sessoes.findByPk(idSessao);

        if (!sessao) {
            return res.status(404).json({ erro: 'Sessão não encontrada para o id informado.' });
        }

        // Atualiza somente os campos que vieram
        if (idFilme !== undefined) sessao.idFilme = idFilme;
        if (idSala !== undefined) sessao.idSala = idSala;
        if (hora !== undefined) sessao.hora = hora;
        if (data !== undefined) sessao.data = data;
        if (status !== undefined) sessao.status = status;

        if (status !== undefined && ![0, 1].includes(status)) {
            return res.status(400).json({ erro: 'Status inválido. Use 0 para inativo ou 1 para ativo.' });
        }


        await sessao.save();

        res.status(200).json({
            mensagem: 'Sessão atualizada com sucesso',
            sessao: sessao
        });

    } catch (error) {
        console.error('Erro ao editar sessão:', error);

        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ erro: 'Token inválido ou expirado' });
        }

        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
};




exports.listarSessoes = async (req, res) => {
   
    try{
        // filtro por status se fornecido na URL, deve chamar : /listarSessoes?status=1 / 0 / 1,0
        const where = {};
        if (status !== undefined) {
            const statusArray = String(status).split(',').map(s => Number(s));
            if (statusArray.length > 1) {
                where.status = { [Op.in]: statusArray };
            } else {
                where.status = statusArray[0];
            }
        }
        const listaSessoes = await models.sessoes.findAll({
            attributes: ['idSessao', 'idFilme', 'idSala', 'hora', 'data', 'status'],
            where
        });

        res.status(200).json(listaSessoes);
    } catch (error) {
        console.error('Erro ao listar sessões:', error);
    }
}


// lista sessoes futuras para clientes
exports.listarSessoesFuturas = async (req, res) => {
    const authHeader = req.headers.authorization;
    // listar sessões por filtro de status, apenas ativos(futuras)

    try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


        const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ erro: 'token inválido ou expirado' });
            }

            console.log(decoded);
            return decoded;
        });

        console.log('cliente:', autenticado);


        const listaSessoesFuturas = await models.sessoes.findAll({
            where: {
                status: 1,
                [Op.and]: [
                    Sequelize.literal(`TIMESTAMP(data, hora) > NOW()`)
                ]
            },
            order: [
                ['data', 'ASC'],

                ['hora', 'ASC']
            ],
            include: [
                'idFilme_filme',
                'idSala_sala'
            ]
        });

        res.status(200).json(listaSessoesFuturas);
    } catch (error) {
        console.error('Erro ao listar sessões futuras:', error);
    }
}


// mostra detalhes da sessao ao mandar idSessao
exports.detalhesSessao = async (req, res) => {
    const authHeader = req.headers.authorization;
    const { titulo } = req.body;

    try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


        const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ erro: 'token inválido ou expirado' });
            }

            console.log(decoded);
            return decoded;
        });

        console.log('cliente:', autenticado);

        if (!titulo) {
            return res.status(400).json({ erro: 'Título do filme é obrigatório.' });
        }

        const filme = await filmes.findOne({
            where: {
                titulo: titulo
            },
            include: [
                {
                    model: sessoes,
                    as: 'sessos'
                }
            ]
        });

        if (!filme) {
            return res.status(404).json({ erro: 'Filme não encontrado.' });
        }

        res.status(200).json(filme);
    } catch (error) {
        console.error('Erro ao obter detalhes da sessão:', error);
    }
}


// buscar sessões pelo id do filme no req params
exports.sessoesPorFilme = async (req, res) => {
    const authHeader = req.headers.authorization;
    const { idFilme } = req.params;

    try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


        const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ erro: 'token inválido ou expirado' });
            }

            console.log(decoded);
            return decoded;
        });

        console.log('cliente:', autenticado);


        const sessoesDoFilme = await models.sessoes.findAll({
            where: {
                idFilme: idFilme,
                status: 1
            }, include: [
                {
                    model: models.filmes,
                    as: 'idFilme_filme',
                    attributes: [
                        'titulo',
                        'duracao',
                        'idioma',
                        'capa',
                        'sinopse'
                    ],
                    include: [
                        {
                            model: models.generos,
                            as: 'idGenero_genero',
                            attributes: [
                                'nome',
                                'classificacao'
                            ]
                        }
                    ]
                },
                {
                    model: models.salas,
                    as: 'idSala_sala',
                    attributes: [
                        'numero'
                    ]
                },
                {
                    model: models.salasTipo,
                    as: 'idSalasTipo_salasTipo',
                    attributes: [
                        'tipo',
                        'valor'
                    ]
                }
            ]
        });

        res.status(200).json(sessoesDoFilme);
    } catch (error) {
        console.error('Erro ao buscar sessões pelo filme:', error);
    }
}

exports.sessaoAtivo = async (req, res) => {
      try {
    const sessaoAtivos = await models.sessoes.findAll({
      where: { status: 1 }
    });

    res.status(200).json(sessaoAtivos);

  } catch (error) {
    console.error("Erro ao listar sessões ativas:", error);
    res.status(500).json({ erro: "Erro ao buscar sessões ativas." });
  }
};
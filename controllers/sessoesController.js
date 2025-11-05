const { where } = require("sequelize");
const { Op } = require("sequelize");
const { sequelize, Sequelize } = require("../models/db");
const sessoes = require("../models/sessoes")(sequelize, Sequelize.DataTypes);
const filmes = require("../models/filmes")(sequelize, Sequelize.DataTypes);
const salas = require("../models/salas")(sequelize, Sequelize.DataTypes);

// token
const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';

// função editar data
const { converterDataISO } = require("../service/converterDataISO");

exports.criarSessao = async (req, res) => {
    console.log('criando sessao');
    const authHeader = req.headers.authorization;
    const { idFilme, idSala, hora, data } = req.body;

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

        // Converte data para formato ISO (YYYY-MM-DD)
        const dataISO = converterDataISO(data);
        if (!dataISO) return res.status(400).json({ erro: 'Data inválida' });


        const sessaoExistente = await sessoes.findOne({
            where: {
                idFilme: idFilme,
                idSala: idSala,
                hora: hora,
                data: dataISO
            }
        });

        if (sessaoExistente) {
            return res.status(400).json({ erro: 'Sessão já existe para o filme, sala, hora e data informados.' });
        }



        const novaSessao = await sessoes.create({
            idFilme: idFilme,
            idSala: idSala,
            hora: hora,
            data: dataISO
        });


        const sessaoFormatada = {
            ...novaSessao.toJSON(),
            data: new Date(novaSessao.data).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
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
    const { idFilme, idSala, hora, data } = req.body;

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

        const sessao = await sessoes.findOne({
            where: {
                idFilme: idFilme,
                idSala: idSala,
                hora: hora,
                data: data
            }
        });
        console.log(sessao);

        if (!sessao) {
            return res.status(404).json({ erro: 'Sessão não encontrada para o filme, sala, hora e data informados.' });
        }

        sessao.hora = hora ?? sessao.hora;
        sessao.data = data ?? sessao.data;
        sessao.idFilme = idFilme ?? sessao.idFilme;
        sessao.idSala = idSala ?? sessao.idSala;

        await sessao.save();

        res.status(200).json({
            mensagem: 'Sessão atualizada com sucesso',
            sessao: sessao
        });
    } catch (error) {
        console.error('Erro ao editar sessão:', error);
    }
}


exports.deletarSessao = async (req, res) => {
    const authHeader = req.headers.authorization;
    const { idSessao } = req.body;

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

        const sessao = await sessoes.findOne({
            where: {
                idSessao: idSessao
            }
        });

        if (!sessao) {
            return res.status(404).json({ erro: 'Sessão não encontrada para o id informado.' });
        }

        await sessao.destroy();
        res.status(200).json({ mensagem: 'Sessão deletada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar sessão:', error);
    }
}


exports.listarSessoes = async (req, res) => {
    const authHeader = req.headers.authorization;


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

        const listaSessoes = await sessoes.findAll({
            attributes: ['idSessao', 'idFilme', 'idSala', 'hora', 'data']
        });

        res.status(200).json(listaSessoes);
    } catch (error) {
        console.error('Erro ao listar sessões:', error);
    }
}


// lista sessoes futuras para clientes
exports.listarSessoesFuturas = async (req, res) => {
    const authHeader = req.headers.authorization;

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

        const agora = new Date();

        const listaSessoesFuturas = await sessoes.findAll({
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
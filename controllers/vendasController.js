const { where } = require("sequelize");
const { Op } = require("sequelize");
const { sequelize, Sequelize } = require("../models/db");

const initModels = require('../models/init-models');
const models = initModels(sequelize, Sequelize.DataTypes);


// token
const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';


exports.realizarVenda = async (req, res) => {
    console.log('realizando venda');
    const authHeader = req.headers.authorization;
    const { idSessao, cadeiras, idCliente } = req.body;

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

        console.log('Cliente autenticado:', idCliente);

        if (!idCliente) {
            return res.status(400).json({ erro: 'idCliente é obrigatório para administrador' });
        }


        if (!idSessao || !cadeiras || !Array.isArray(cadeiras) || cadeiras.length === 0) {
            return res.status(400).json({ erro: 'sessão e cadeiras são obrigatórios' })
        }

        const sessao = await models.sessoes.findByPk(idSessao, {
            include: [
                {
                    model: models.salasTipo,
                    as: 'idSalasTipo_salasTipo',
                    attributes: ['idSalasTipo', 'tipo', 'valor']
                }
            ]
        });

        if (!sessao) {
            return res.status(404).json({ erro: 'sessão não encontrada' });
        }

        const precoIngresso = parseFloat(sessao.idSalasTipo_salasTipo.valor);
        console.log(`Preço do ingresso (${sessao.idSalasTipo_salasTipo.tipo}): R$ ${precoIngresso}`);

        const cadeirasSelecionadas = await models.salasCadeira.findAll({
            where: { idSalasCadeira: cadeiras }
        });

        if (cadeirasSelecionadas.length !== cadeiras.length) {
            return res.status(400).json({ erro: 'uma ou mais cadeiras não existem' });
        }


        // mostra se foi escolhido cadeiras já vendidas
        const cadeirasVendidas = await models.vendasItens.findAll({
            where: {
                idSalasCadeira: cadeiras,
            },
            include: [
                {
                    model: models.vendas,
                    as: 'idVenda_venda',
                    where: { idSessao: idSessao }
                }
            ]
        });

        if (cadeirasVendidas.length > 0) {
            // Retorna as cadeiras que já foram vendidas
            const numerosVendidos = cadeirasVendidas.map(v => ({
                id: v.idSalasCadeira
            }));
            return res.status(400).json({
                erro: 'uma ou mais cadeiras já foram vendidas para esta sessão',
                cadeirasVendidas: numerosVendidos
            });
        }

        const valorTotal = precoIngresso * cadeirasSelecionadas.length;

        const novaVenda = await models.vendas.create({
            idCliente: idCliente,
            idSala: sessao.idSala,
            idSessao: idSessao,
            valorTotal,
            qtde: cadeirasSelecionadas.length,
            status: 1
        });

        const itens = cadeirasSelecionadas.map(cadeira => ({
            idVenda: novaVenda.idVenda,
            idSalasCadeira: cadeira.idSalasCadeira,
            precoUnitario: precoIngresso,
            status: 1
        }));

        await models.vendasItens.bulkCreate(itens);

        return res.status(201).json({
            mensagem: 'Venda realizada com sucesso',
            venda: {
                idVenda: novaVenda.idVenda,
                sessao: {
                    id: sessao.idSessao,
                    data: sessao.data,
                    hora: sessao.hora,
                    tipoSala: sessao.idSalasTipo_salasTipo.tipo
                },
                cadeiras: cadeirasSelecionadas.map(c => ({
                    id: c.idSalasCadeira,
                    fileira: c.fileira,
                    coluna: c.coluna,
                    numero: c.numero
                })),
                precoUnitario: precoIngresso,
                total: valorTotal
            }
        });


    } catch (error) {
        console.error('Erro ao realizar venda:', error);
    }
};



exports.vendasPorCLiente = async (req, res) => {
    console.log('buscando vendas por cliente');

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

        const idCliente = req.params.idCliente;

        // Busca todas as vendas do cliente
        const vendas = await models.vendas.findAll({
            where: { idCliente },
            include: [
                {
                    model: models.sessoes,
                    as: 'idSessao_sesso',
                    attributes: ['idSessao', 'data', 'hora'],
                    include: [
                        {
                            model: models.filmes,
                            as: 'idFilme_filme',
                            attributes: ['titulo', 'duracao', 'idioma', 'capa']
                        },
                        {
                            model: models.salas,
                            as: 'idSala_sala',
                            attributes: ['numero']
                        }
                    ]
                },
                {
                    model: models.vendasItens,
                    as: 'vendasItens',
                    include: [
                        {
                            model: models.salasCadeira,
                            as: 'idSalasCadeira_salasCadeira',
                            attributes: ['fileira', 'coluna', 'numero']
                        }
                    ]
                }
            ],
            order: [['idVenda', 'DESC']]
        });

        if (vendas.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhuma venda encontrada para este cliente' });
        }

        // Formata a resposta
        const resultado = vendas.map(venda => ({
            idVenda: venda.idVenda,
            valorTotal: venda.valorTotal,
            status: venda.status,
            sessao: {
                idSessao: venda.idSessao_sesso.idSessao,
                data: venda.idSessao_sesso.data,
                hora: venda.idSessao_sesso.hora,
                filme: venda.idSessao_sesso.idFilme_filme.titulo,
                sala: venda.idSessao_sesso.idSala_sala.numero
            },
            cadeiras: venda.vendasItens.map(item => ({
                id: item.idSalasCadeira,
                fileira: item.idSalasCadeira_salasCadeira.fileira,
                coluna: item.idSalasCadeira_salasCadeira.coluna,
                numero: item.idSalasCadeira_salasCadeira.numero,
                precoUnitario: item.precoUnitario
            }))
        }));

        return res.status(200).json(resultado);

    } catch (error) {
        console.error('Erro ao buscar vendas do cliente:', error);
    }
}



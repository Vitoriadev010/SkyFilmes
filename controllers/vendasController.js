const { Op } = require("sequelize");
const { sequelize, Sequelize } = require("../models/db");
const initModels = require('../models/init-models');
const models = initModels(sequelize, Sequelize.DataTypes);
const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';

// Status de Vendas
const STATUS_PENDENTE = 1;
const STATUS_PAGO = 2;
const STATUS_FALHADO = 3;

/** 
 * @param {Array<number>} ideSalaArray - Array de IDs das cadeiras.
 * @param {object} transaction - Transação Sequelize.
 * @returns {Promise<void>} - Rejeita se os assentos estiverem ocupados.
 */
async function verificarDisponibilidade(ideSalaArray, transaction) {
    const assentosOcupados = await models.vendasItens.findAll({
        where: {
            ideSala: { [Op.in]: ideSalaArray }
        },
        include: [{
            model: models.vendas,
            as: 'idVenda_venda',
            where: { status: STATUS_PAGO },
            required: true
        }],
        transaction: transaction
    });

    if (assentosOcupados.length > 0) {
        const idsOcupados = assentosOcupados.map(item => item.ideSala);
        throw new Error(`Conflito: Assento(s) ${idsOcupados.join(', ')} já estão ocupados.`);
    }
}

exports.realizarVenda = async (req, res) => {
    console.log('Iniciando realização de venda...');
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

    const { idCliente } = req.params;
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

        console.log('Cliente autenticado:', idCliente);
        console.log('Buscando vendas do cliente ID:', idCliente);

        // Busca as vendas do cliente com:  sessão, tipo da sala e itens (cadeiras)
        const vendas = await models.vendas.findAll({
            where: { idCliente },
            include: [
                {
                    model: models.vendasItens,
                    as: 'vendasItens',
                    include: [
                        {
                            model: models.salasCadeira,
                            as: 'idSalasCadeira_salasCadeira',
                            attributes: ['idSalasCadeira', 'fileira', 'coluna', 'numero'],
                            include: [
                                {
                                    model: models.salas,
                                    as: 'idSala_sala',
                                    attributes: ['ideSala', 'numero']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: models.sessoes,
                    as: 'idSessao_sesso',
                    attributes: ['idSessao', 'data', 'hora'],
                    include: [
                        {
                            model: models.salas,
                            as: 'idSala_sala',
                            attributes: ['ideSala', 'numero']
                        },

                        {
                            model: models.salasTipo,
                            as: 'idSalasTipo_salasTipo',
                            attributes: ['idSalasTipo', 'tipo', 'valor']
                        }


                    ]
                },
                {
                    model: models.salas,
                    as: 'idSala_sala',
                    attributes: ['ideSala', 'numero']
                }
            ],
            order: [['idVenda', 'DESC']]
        });

        if (!vendas || vendas.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhuma venda encontrada para este cliente.' });
        }

        // resposta
        const resposta = vendas.map(venda => ({
            idVenda: venda.idVenda,
            valorTotal: venda.valorTotal,
            qtde: venda.qtde,
            status: venda.status,
            sala: venda.idSala_sala ? venda.idSala_sala.numero : null,
            sessao: venda.idSessao_sesso ? {
                idSessao: venda.idSessao_sesso.idSessao,
                data: venda.idSessao_sesso.data,
                hora: venda.idSessao_sesso.hora,
                sala: venda.idSessao_sesso.idSala_sala?.numero,
                tipoSala: venda.idSessao_sesso.idSala_sala?.idSalasTipo_salasTipo?.tipo,
                valorIngresso: venda.idSessao_sesso.idSala_sala?.idSalasTipo_salasTipo?.valor
            } : null,
            cadeiras: venda.vendasItens.map(item => ({
                id: item.idSalasCadeira_salasCadeira?.idSalasCadeira,
                fileira: item.idSalasCadeira_salasCadeira?.fileira,
                coluna: item.idSalasCadeira_salasCadeira?.coluna,
                numero: item.idSalasCadeira_salasCadeira?.numero,
                precoUnitario: item.precoUnitario
            }))
        }));

        return res.status(200).json({
            cliente: idCliente,
            totalVendas: resposta.length,
            vendas: resposta
        });

    } catch (error) {
        console.error('Erro ao buscar vendas por cliente:', error);
        return res.status(500).json({ erro: 'Erro ao buscar vendas por cliente.' });
    }
};

// LISTAR TODAS AS VENDAS

exports.listarvendas = async (req, res) => {

    const authHeader = req.headers.authorization;

    try {
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;

        const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ erro: 'Token inválido ou expirado.' });
            }
            return decoded;
        });

        console.log('gestor:', autenticado);

        const vendas = await models.vendas.findAll();
        res.json(vendas);
    } catch (error) {
        console.error("Erro ao listar todas as vendas:", error);
        res.status(500).send("Erro ao listar todas as vendas.");
    }
};


exports.editarVenda = async (req, res) => {
    const authHeader = req.headers.authorization;
    const { idVenda } = req.params;
    const { status } = req.body;

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



        if (![1, 2, 3].includes(Number(status))) {
            return res.status(400).json({
                erro: 'Status inválido. Use: 1 = pendente, 2 = pago, 3 = recusado.'
            });
        }

        const venda = await models.vendas.findByPk(idVenda);
        if (!venda) {
            return res.status(404).json({ erro: 'Venda não encontrada.' });
        }

        // atualizando status
        await venda.update({ status });

        // m ostra a atualização da venda toda
        return res.status(200).json({
            mensagem: 'Status da venda atualizado com sucesso!',
            venda: {
                idVenda: venda.idVenda,
                status: venda.status,
                statusDescricao:
                    venda.status === 1
                        ? 'Pendente'
                        : venda.status === 2
                            ? 'Pago'
                            : 'Recusado'
            }
        });
    } catch (error) {
        console.error('Erro ao editar venda:', error);
    }
};


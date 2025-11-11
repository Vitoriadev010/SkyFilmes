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

    let autenticado;

    try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
        if (!token) {
            return res.status(401).json({ erro: 'Token não fornecido.' });
        }
        
        autenticado = jwt.verify(token, SECRET);
        console.log('Cliente autenticado:', autenticado);

    } catch (err) {
        console.log(err);
        return res.status(403).json({ erro: 'Token inválido ou expirado' });
    }

    const idCliente = autenticado.id; 
    const { idSessao, ideSala } = req.body;

    if (!idSessao || !ideSala || !Array.isArray(ideSala) || ideSala.length === 0) {
        return res.status(400).json({ erro: 'idSessao e um array ideSala são obrigatórios.' });
    }

    const t = await sequelize.transaction();
    let novaVenda; 

    try {
        await verificarDisponibilidade(ideSala, t);

        const sessao = await models.sessoes.findByPk(idSessao, { transaction: t });
        if (!sessao) {
            throw new Error('Sessão não encontrada.');
        }

        const precoUnitario = sessao.valorIngresso; 
        if (typeof precoUnitario !== 'number') {
             throw new Error('Não foi possível determinar o preço do ingresso para esta sessão.');
        }

        const idSala = sessao.idSala;
        const qtde = ideSala.length;
        const valorTotal = precoUnitario * qtde;

        novaVenda = await models.vendas.create({
            idCliente: idCliente,
            idSala: idSala,
            idSessao: idSessao,
            valorTotal: valorTotal,
            qtde: qtde,
            status: STATUS_PENDENTE 
        }, { transaction: t });

        const itensVenda = ideSala.map(idCadeira => ({
            idVenda: novaVenda.idVenda,
            ideSala: idCadeira,
            precoUnitario: precoUnitario,
            status: 1 // Default
        }));

        await models.vendasItens.bulkCreate(itensVenda, { transaction: t });

        await t.commit();
        console.log(`Venda ${novaVenda.idVenda} criada como PENDENTE.`);
    } catch (error) {
        await t.rollback();
        console.error('Erro ao criar venda pendente:', error.message);

        if (error.message.includes('Conflito')) {
            return res.status(409).json({ erro: error.message }); 
        }
        return res.status(500).json({ erro: 'Erro ao processar a venda.' });
    }

    try {
        console.log(`Simulando pagamento para Venda ${novaVenda.idVenda}...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); 

        const simulacaoAprovada = Math.random() < 0.9; 

        if (simulacaoAprovada) {
            await novaVenda.update({ status: STATUS_PAGO });
            console.log(`Venda ${novaVenda.idVenda} atualizada para PAGO.`);
            return res.status(201).json({
                status: 'PAGO',
                message: 'Pagamento aprovado com sucesso!',
                venda: novaVenda
            });
        } else {
            await novaVenda.update({ status: STATUS_FALHADO });
            console.log(`Venda ${novaVenda.idVenda} atualizada para FALHADO.`);
            return res.status(400).json({
                status: 'FALHADO',
                message: 'Pagamento recusado pela operadora.',
                venda: novaVenda
            });
        }

    } catch (error) {
        console.error('Erro crítico durante a simulação de pagamento:', error);
        if (novaVenda) {
            await novaVenda.update({ status: STATUS_FALHADO });
        }
        return res.status(500).json({ 
            erro: 'Ocorreu um erro no processamento do pagamento.',
            status: 'FALHADO'
        });
    }
};

// LISTAR TODAS AS VENDAS

exports.listarvendas = async (req, res) => {
    
 const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não enviado' });
  }

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

const { Op } = require("sequelize");
const { sequelize, Sequelize } = require("../models/db");
const initModels = require('../models/init-models');
const models = initModels(sequelize, Sequelize.DataTypes);
const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';


/// STATUS DE VENDAS
const STATUS_PENDENTE = 1;
const STATUS_PAGO = 2;
const STATUS_RECUSADO = 3;



/**
 * @param {Array<number>} idSalasCadeiraArray - Array de IDs das cadeiras.
 * @param {object} transaction - Transação Sequelize.
 * @returns {Promise<void>} - Rejeita se os assentos estiverem ocupados.
 */
async function verificarDisponibilidade(idSalasCadeiraArray, transaction) {
  const assentosOcupados = await models.vendasItens.findAll({
    where: {
      idSalasCadeira: { [Op.in]: idSalasCadeiraArray },
    },
    include: [
      {
        model: models.vendas,
        as: "idVenda_venda",
        where: { status: STATUS_PAGO },
        required: true,
      },
    ],
    transaction,
  });

  if (assentosOcupados.length > 0) {
    throw new Error("Alguns assentos selecionados já estão ocupados!");
  }
}


exports.realizarvenda = async (req, res) => {
  console.log("Usuário logado:", req.user);

  let t;

  try {
    const { idCliente, idGestor, idSessao, cadeiras } = req.body;


    if ((idCliente && idGestor) || (!idCliente && !idGestor)) {
  return res.status(400).json({
    erro: "Envie apenas Cliente ou Gestor. Nunca envie ambos e nunca deixe os dois vazios."
  });
}



if (!idSessao || !Array.isArray(cadeiras) || cadeiras.length === 0) {
  return res.status(400).json({
    erro: "Dados incompletos. Envie Sessao e cadeiras."
  });
}


if ((idCliente && idGestor) || (!idCliente && !idGestor)) {
  return res.status(400).json({
    erro: "Envie Cliente OU Gestor. Nunca ambos."
  });
}

    const qtde = cadeiras.length;

    t = await sequelize.transaction();

    const sessao = await models.sessoes.findByPk(idSessao);
    if (!sessao) {
      await t.rollback();
      return res.status(404).json({ erro: "Sessão não encontrada." });
    }

    const idSala = sessao.idSala; // Agora buscamos automaticamente pela sessão


    const salaTipo = await models.salasTipo.findByPk(sessao.idSalasTipo);
    if (!salaTipo) {
      await t.rollback();
      return res.status(400).json({
        erro: "Tipo de sala não encontrado."
      });
    }

    const precoUnitario = Number(salaTipo.valor);
    if (!precoUnitario || precoUnitario <= 0) {
      await t.rollback();
      return res.status(400).json({
        erro: "SalasTipo não possui valor definido."
      });
    }

    if (sessao.assentosDisponiveis < qtde) {
      await t.rollback();
      return res.status(400).json({
        erro: "Não há assentos suficientes na sessão."
      });
    }

    const cadeirasInfo = await models.salasCadeira.findAll({
      where: { idSalasCadeira: cadeiras }
    });

    if (cadeirasInfo.length !== cadeiras.length) {
      await t.rollback();
      return res.status(400).json({
        erro: "Uma ou mais cadeiras não existem."
      });
    }


    for (const cadeira of cadeirasInfo) {


      if (cadeira.idSala !== idSala) {
        await t.rollback();
        return res.status(400).json({
          erro: `A cadeira ${cadeira.idSalasCadeira} não pertence à sala da sessão.`
        });
      }

      if (cadeira.status === 0) {
        await t.rollback();
        return res.status(400).json({
          erro: `A cadeira ${cadeira.idSalasCadeira} já está ocupada.`
        });
      }
    }

    const valorTotal = precoUnitario * qtde;

    // criar venda
    const venda = await models.vendas.create(
      {
       idCliente: idCliente || null,
       idGestor: idGestor || null,
        idSessao,
        idSala,
        qtde,
        valorTotal,
        status: 1
      },
      { transaction: t }
    );

    for (const cadeira of cadeirasInfo) {
      await models.vendasItens.create(
        {
          idVenda: venda.idVenda,
          idSalasCadeira: cadeira.idSalasCadeira,
          precoUnitario,
          status: 1
        },
        { transaction: t }
      );

      await cadeira.update({ status: 0 }, { transaction: t });
    }

    await sessao.update(
      { assentosDisponiveis: sessao.assentosDisponiveis - qtde },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      mensagem: "Venda realizada com sucesso!",
      venda,
      precoUnitario,
      valorTotal,
      cadeirasEscolhidas: cadeiras
    });

  } catch (erroInterno) {
    if (t) await t.rollback();
    console.error("Erro ao registrar venda:", erroInterno);
    return res.status(500).json({
      erro: "Erro ao registrar venda.",
      detalhes: erroInterno.message
    });
  }
};





exports.vendasPorCLiente = async (req, res) => {
  console.log("Usuário logado:", req.user);

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
                  attributes: ['idSala', 'numero']
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
              attributes: ['idSala', 'numero']
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
          attributes: ['idSala', 'numero']
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
  console.log("Usuário logado:", req.user);

  try {
    const vendas = await models.vendas.findAll({
      attributes: ['idVenda', 'valorTotal', 'qtde', 'status'],
      include: [
        {
          model: models.clientes,
          as: 'idCliente_cliente',
          attributes: ['nome']
        },
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
                  attributes: ['idSala', 'numero']
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
              attributes: ['idSala', 'numero']
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
          attributes: ['idSala', 'numero']
        }
      ],
      order: [['idVenda', 'DESC']]
    });


    res.json(vendas);
  } catch (error) {
    console.error("Erro ao listar todas as vendas:", error);
    res.status(500).send("Erro ao listar todas as vendas.");
  }
};


exports.editarVenda = async (req, res) => {
  console.log("Usuário logado:", req.user);

  const { idVenda } = req.params;
  const { status } = req.body;

  try {

    if (![1, 2, 3].includes(Number(status))) {
      return res.status(400).json({
        erro: 'Status inválido. Use: 1 = pendente, 2 = pago, 3 = recusado.'
      });
    }

    const venda = await models.vendas.findByPk(idVenda);
    if (!venda) {
      return res.status(404).json({ erro: 'Venda não encontrada.' });
    }


    await venda.update({ status });


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


// listar status situção de cada venda // 

exports.listarStatusVendas = async (req, res) => {
  console.log("Usuário logado:", req.user);

  const { status } = req.params;


  try {

    const vendas = await models.vendas.findAll({
      where: { status },
      include: [{ model: models.vendasItens, as: "vendasItens" }
      ]
    });

    if (vendas.length === 0) {

      const label = status == 1 ? "pendente" : (status == 2 ? "pago" : "falhado");
      return res.status(404).send(`Nenhum status encontrado para ${label}.`);
    }

    res.json(vendas);
  } catch (error) {

    console.error("Erro ao buscar status de vendas:", error);
    res.status(500).send("Erro ao buscar status de vendas.");
  }
};

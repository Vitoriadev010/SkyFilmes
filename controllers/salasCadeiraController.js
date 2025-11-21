// controllers/salasCadeiraController.js

const { sequelize, Sequelize } = require("../models/db");
const initModels = require("../models/init-models");
const models = initModels(sequelize, Sequelize.DataTypes);

const jwt = require('jsonwebtoken'); // Mantido, conforme código original
const salasCadeira = require("../models/salasCadeira");
const SECRET = 'APIbilheteria'; // Mantido, conforme código original

// ========= Adicionar nova(s) cadeira(s) (ADMIN) =========

exports.adicionarCadeira = async (req, res) => {
  console.log("Usuário logado:", req.user);

  try {
    // ===== Verifica se o corpo é um array ou um único objeto =====
    const body = req.body;

    // Caso receba várias cadeiras (array)
    if (Array.isArray(body)) {
      const criadas = await models.salasCadeira.bulkCreate(body);
      return res.status(201).json({
        message: `${criadas.length} cadeiras criadas com sucesso!`,
        cadeiras: criadas
      });
    }

    // Caso receba uma cadeira só (objeto)
    const novaCadeira = await models.salasCadeira.create(body);
    return res.status(201).json({
      message: "Cadeira criada com sucesso!",
      cadeira: novaCadeira
    });

  } catch (error) {
    console.error("Erro ao adicionar cadeira(s):", error);
    return res.status(500).json({ error: "Erro ao adicionar cadeira(s)!" });
  }
};


// ======== Listar cadeiras (TODOS) ===========

exports.listarCadeiras = async (req, res) => {

  try {

    const todasCadeiras = await models.salasCadeira.findAll();

    return res.status(200).json(todasCadeiras);
  } catch (error) {
    console.error("erro ao listar cadeiras: ", error);
    return res.status(500).json({ error: "erro ao listar cadeiras!" });

  }
};

// ========== Listar cadeiras por idSala (TODOS) ==========


exports.listarCadeiraId = async (req, res) => {
  const { idSala } = req.params;


  try {


    const cadeiras = await models.salasCadeira.findAll({
      where: { idSala: idSala }
    });

    if (!cadeiras || cadeiras.length === 0) {
      return res.status(404).send("Cadeiras não encontradas para a sala informada!");
    }

    return res.status(200).json(cadeiras);
  } catch (error) {
    console.error("erro ao buscar cadeira por id: ", error);
    return res.status(500).json({ error: "erro ao buscar cadeira por id!" });

  }

}


// ======== atualizar cadeira (ADMIN) ==========

exports.atualizarCadeira = async (req, res) => {
  console.log("Usuário logado:", req.user);

  const { id } = req.params;


  try {
    const cadeira = await models.salasCadeira.findByPk(id); // USANDO models.salasCadeira CORRETAMENTE

    if (!cadeira) {
      return res.status(404).send("Cadeira não encontrada!");
    }

    const { fileira, coluna, status } = req.body;

    if (fileira) cadeira.fileira = fileira;
    if (coluna) cadeira.coluna = coluna;
    if (status !== undefined) cadeira.status = status;
    if (status !== undefined && ![0, 1].includes(status)) {
      return res.status(400).send("Status inválido. Use 0 para inativo e 1 para ativo.");
    } // em vez de deletar, apenas atualizar status

    await cadeira.save();

    return res.status(200).json({
      message: "Cadeira atualizada com sucesso!",
      cadeira: cadeira
    });

  } catch (error) {
    console.error("Erro ao atualizar cadeira: ", error);
    return res.status(500).json({ error: "Erro ao atualizar cadeira!" });
  }
}

exports.cadeiraAtiva = async (req, res) => {
  try {
    const cadeiraAtivos = await models.salasCadeira.findAll({
      where: { status: 1 }
    });

    res.status(200).json(cadeiraAtivos);

  } catch (error) {
    console.error("Erro ao listar cadeira(s) ativas:", error);
    res.status(500).json({ erro: "Erro ao buscar cadeira(s) ativas." });
  }
};






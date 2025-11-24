const { sequelize, Sequelize } = require("../models/db");
const initModels = require("../models/init-models");
const models = initModels(sequelize, Sequelize.DataTypes);
const jwt = require("jsonwebtoken");

const SECRET = "APIbilheteria";

// ======== Adicionar sala (ADMIN) =========
exports.adicionarSala = async (req, res) => {

  try {
    // CORRIGIDO: Removido 'idFilme' do corpo, pois não existe no model 'salas.js'
    let {  numero } = req.body;

    const novaSala = await models.salas.create({
      numero
    });

    return res.status(201).json(novaSala);

  } catch (error) {
    console.error("erro ao adicionar nova sala:", error);
    return res.status(500).json({ error: "erro ao adicionar nova sala!" });
  }
};

// ======= Listar salas (ADMIN) ==========
exports.listarSalas = async (req, res) => {
  console.log("Usuário logado:", req.user);


  try {
    const todasSalas = await models.salas.findAll();

    return res.status(200).json(todasSalas);
  } catch (error) {
    console.error("Erro ao listar salas:", error);
    return res.status(500).json({ erro: "Erro interno ao listar salas" });
  }
};

// ======= Listar sala por ID (CLIENTE) ==========  (D)
exports.ListarSalaPorID = async (req, res) => {
  try{
    const { id } = req.params;

    const sala = await models.salas.findOne({
      where: { idSala: id },
      include: [
       
      ]
    });

    if (!sala) {
      return res.status(404).json({ erro: "Sala não encontrada!" });
    }

    return res.status(200).json(sala);
  } catch (error) {
    console.error("Erro ao buscar sala por ID:", error);
    return res.status(500).json({ erro: "Erro ao buscar sala por ID!" });
  }
};


// ======== Atualizar sala (ADMIN) =========
exports.atualizarSala = async (req, res) => {
  console.log("Usuário logado:", req.user);

  try {
    const { id } = req.params;
    const { ideSala, numero, status } = req.body;


    const sala = await models.salas.findByPk(id);
    if (!sala) {
      return res.status(404).send("Sala não encontrada.");
    }

    if (numero !== undefined) {
      if (numero <= 0) {
        return res.status(400).send("Número de sala inválido.");
      }
      sala.numero = numero;
    }

    if (status !== undefined) {
      if (![0, 1].includes(status)) {
        return res.status(400).send("Status inválido. Use 0 (inativo) ou 1 (ativo).");
      }
      sala.status = status;
    }

    await sala.save();

    return res.status(200).json({
      message: "Sala atualizada com sucesso!",
      sala,
    });
  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    return res.status(500).send("Erro ao atualizar a sala.");
  }
};



exports.salasAtiva = async (req, res) => {
  try {
    const salasAtivos = await models.salas.findAll({
      where: { status: 1 }
    });

    res.status(200).json(salasAtivos);

  } catch (error) {
    console.error("Erro ao listar salas ativas:", error);
    res.status(500).json({ erro: "Erro ao buscar salas ativas." });
  }
};


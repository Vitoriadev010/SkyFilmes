// controllers/salasController.js

const { sequelize, Sequelize } = require("../models/db");
const initModels = require("../models/init-models");
const models = initModels(sequelize, Sequelize.DataTypes);

const jwt = require('jsonwebtoken');
const SECRET = 'APIbilheteria';


// ======== Adicionar sala (ADMIN) =========

exports.adicionarSala = async (req, res) => {
  const authHeader = req.headers.authorization;

  try {
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ erro: 'token inválido ou expirado' });
      }

      console.log(decoded);
      return decoded;
    });

    console.log('gestor:', autenticado);

    let { ideSala, numero } = req.body;

    const novaSala = await models.salas.create({
      ideSala,
      numero,
    });

    return res.status(201).json(novaSala);
  } catch (error) {
    console.error("erro ao adicionar nova sala:", error);
    return res.status(500).json({ error: "erro ao adicionar nova sala!" });
  }
};



// ======= Listar salas (ADMIN) ==========

exports.listarSalas = async (req, res) => {
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

    const todasSalas = await models.salas.findAll();
    return res.status(200).json(todasSalas);
  } catch (error) {
    console.error("erro ao listar salas:", error);
    return res.status(500).json({ erro: "Erro interno ao listar salas" });
  }
};



// ======= Listar sala por ID (CLIENTE) ==========

exports.ListarSalaPorID = async (req, res) => {
  const authHeader = req.headers.authorization;

  try {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ erro: "Token inválido ou expirado." });
      }
      console.log(decoded);
      return decoded;
    });

    if (!autenticado) {
      return;
    }

    console.log("gestor:", autenticado);

    const { id } = req.params;

      const sala = await models.salas.findOne({
  where: { idSala: id },
  include: [
    { model: models.salasTipo, as: 'ideSala_salasTipo' }
  ]
});

     

    if (!sala) {
      return res.status(404).json({ error: "Sala não encontrada!" });
    }

    return res.status(200).json(sala);
  } catch (error) {
    console.error("Erro ao buscar sala por ID:", error);
    return res.status(500).json({ error: "Erro ao buscar sala por ID!" });
  }
};



// ======== Atualizar sala (ADMIN) =========

exports.atualizarSala = async (req, res) => {
  const authHeader = req.headers.authorization;

  try {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ erro: "Token inválido ou expirado." });
      }
      console.log(decoded);
      return decoded;
    });

    if (!autenticado) {
      return;
    }

    console.log("gestor:", autenticado);

    const { id } = req.params;
    const { ideSala, numero, status } = req.body;

    const sala = await models.salas.findByPk(id);
    if (!sala) {
      return res.status(404).send("Sala não encontrada.");
    }

    if (numero) {
      if (numero <= 0)
        return res.status(400).send("Número de sala inválido.");
      sala.numero = numero;
    }

    if (ideSala) sala.ideSala = ideSala;
    if (status !== undefined) sala.status = status;

    if (status !== undefined && ![0, 1].includes(status)) {
      return res.status(400).send("Status inválido. Use 0 para inativo e 1 para ativo.");
    }

    await sala.save();

    return res.status(200).json({
      message: "Sala atualizada com sucesso!",
      sala,
    });
  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ erro: 'Token inválido ou expirado' });
    }
    return res.status(500).send("Erro ao atualizar a sala.");
  }
};

// controllers/salasTipoController.js

const { sequelize, Sequelize } = require("../models/db");
const initModels = require("../models/init-models");
const models = initModels(sequelize, Sequelize.DataTypes);

const jwt = require('jsonwebtoken'); 


// ======== Adicionar tipo de sala (ADMIN) ========

exports.adicionarTipoSala = async (req, res) => {

  // adicionando verificação do token
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


    
        let { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ error: "O campo 'nome' é obrigatório." });
        }
        const novoTipoSala = await models.salasTipo.create({
            tipo: nome, 
            valor: req.body.valor || 0 
        });

        return res.status(201).json(novoTipoSala);
    } catch (error) {
        console.error("Erro ao adicionar tipo de sala:", error);
        return res.status(500).json({ error: "Erro ao adicionar tipo de sala" });
    }
};

// ======== atualizar tipo de sala (ADMIN) =========

exports.atualizarTipoSala = async (req, res) => {
  const { id } = req.params;
  const { nome, status } = req.body;
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

    // USANDO models.salasTipo CORRETAMENTE
    const tipoSala = await models.salasTipo.findByPk(id);

    if (!tipoSala) {
      return res.status(404).json({ error: "Tipo de sala não encontrado." });
    }

    // ATENÇÃO: Mapeando 'nome' -> 'tipo' e usando 'valor' (se fornecido no body)
    if (nome) tipoSala.tipo = nome;
     if (status !== undefined) sala.status = status;
    if (status !== undefined && ![0, 1].includes(status)) {
      return res.status(400).send("Status inválido. Use 0 para inativo e 1 para ativo.");
    } // em vez de deletar, apenas atualizar status

    if (req.body.valor) tipoSala.valor = req.body.valor;


    await tipoSala.save();

    return res
      .status(200)
      .json({ message: "Tipo de sala atualizado com sucesso!", tipoSala });
  } catch (error) {
    console.error("Erro ao atualizar tipo de sala:", error);
    return res
      .status(500)
      .json({ error: "Erro ao atualizar tipo de sala." });
  }
};

// ========== Listar todos os tipo de salas (TODOS) ==========


exports.listarTiposSalas = async (req, res) => {

  const authHeader = req.headers.authorization;
  
    try {
      // ===== Verificação do token (Mantida conforme seu código original) =====
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
      
      if(!autenticado) {
          return; 
      }
  
      console.log("gestor:", autenticado);
  

 
    const tiposSalas = await models.salasTipo.findAll();
    return res.status(200).json(tiposSalas);
  } catch (error) {
    console.error("Erro ao listar tipos de salas: ", error);
    return res.status(500).json({ error: "Erro ao listar tipos de salas!" });
  }
};

// listar tipo de salas ativos //

exports.tipoSalaAtivo = async (req, res) => {
    try {
    const tipoSalaAtivos = await models.salasTipo.findAll({
      where: { status: 1 }
    });

    res.status(200).json(tipoSalaAtivos);

  } catch (error) {
    console.error("Erro ao listar tipo de salas ativos:", error);
    res.status(500).json({ erro: "Erro ao buscar tipos de sala ativos." });
  }
};
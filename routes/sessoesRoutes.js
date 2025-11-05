const express = require("express");
const router = express.Router();
const sessoesController = require("../controllers/sessoesController");

// chamando a verificação do token
const { autenticarToken } = require("../service/token");

// rotas para sessões - gestor //
router.post("/criarSessao", autenticarToken, sessoesController.criarSessao);
router.put("/editarSessao", autenticarToken, sessoesController.editarSessao);
router.delete("/deletarSessao", autenticarToken, sessoesController.deletarSessao);
router.get("/listarSessoes", autenticarToken, sessoesController.listarSessoes);

module.exports = router;
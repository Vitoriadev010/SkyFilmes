const express = require("express");
const router = express.Router();
const sessoesController = require("../controllers/sessoesController");

// chamando a verificação do token
const { autenticarToken } = require("../service/token");

// função para corrigir data sem fuso
const { corrigirDataSemFuso } = require("../service/formatarData");


// rotas para sessões - gestor //
router.post("/criarSessao", autenticarToken, corrigirDataSemFuso, sessoesController.criarSessao);
router.put("/editarSessao", autenticarToken, sessoesController.editarSessao);
router.delete("/deletarSessao", autenticarToken, sessoesController.deletarSessao);
router.get("/listarSessoes", autenticarToken, sessoesController.listarSessoes);

module.exports = router;
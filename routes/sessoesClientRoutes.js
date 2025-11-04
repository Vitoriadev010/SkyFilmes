const express = require("express");
const router = express.Router();
const sessoesController = require("../controllers/sessoesController");

// chamando a verificação do token
const { autenticarToken } = require("../service/token");

// rotas para sessões - cliente //
router.get("/listarSessoesFuturas", autenticarToken, sessoesController.listarSessoesFuturas);
router.get("/detalharSessao", autenticarToken, sessoesController.detalhesSessao);

module.exports = router;
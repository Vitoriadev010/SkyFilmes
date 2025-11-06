const express = require("express");
const router = express.Router();
const sessoesController = require("../controllers/sessoesController");

// chamando a verificação do token
const { autenticarTokenCliente } = require("../service/token");

// rotas para sessões - cliente //
router.get("/listarSessoesFuturas", autenticarTokenCliente, sessoesController.listarSessoesFuturas);
router.get("/detalharSessao", autenticarTokenCliente, sessoesController.detalhesSessao);

module.exports = router;
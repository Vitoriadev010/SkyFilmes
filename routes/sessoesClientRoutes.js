const express = require("express");
const router = express.Router();
const sessoesController = require("../controllers/sessoesController");

// chamando a verificação do token
const { autenticarTokenCliente, autenticarTokenGestor } = require("../service/token");

// rotas para sessões - cliente //
router.get("/listarSessoesFuturas", autenticarTokenCliente, autenticarTokenGestor, sessoesController.listarSessoesFuturas);
router.get("/detalharSessao", autenticarTokenCliente, autenticarTokenGestor, sessoesController.detalhesSessao);

module.exports = router;
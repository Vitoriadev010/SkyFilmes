const express = require("express");

const router = express.Router();


const sessoesController = require("../controllers/sessoesController");


const { autenticarTokenCliente, autenticarTokenGestor } = require("../service/token");


router.get("/detalharSessao", autenticarTokenCliente, autenticarTokenGestor, sessoesController.detalhesSessao);
router.get("/sessoesPorFilme/:idFilme", autenticarTokenCliente, autenticarTokenGestor, sessoesController.sessoesPorFilme);
router.get("/listarSessoesFuturas", autenticarTokenCliente, autenticarTokenGestor, sessoesController.listarSessoesFuturas);


module.exports = router;
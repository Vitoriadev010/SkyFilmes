const express = require("express");

const router = express.Router();


const sessoesController = require("../controllers/sessoesController");


const { autenticarTokenCliente, autenticarTokenGestor } = require("../service/token");


// cliente 
router.get("/detalharSessao", autenticarTokenCliente, sessoesController.detalhesSessao);
router.get("/sessoesPorFilme/:idFilme", autenticarTokenCliente, sessoesController.sessoesPorFilme);
router.get("/sessaoativa", autenticarTokenCliente, sessoesController.sessaoAtivo);



// gestor 
router.get("/detalharSessao", autenticarTokenGestor, sessoesController.detalhesSessao);
router.get("/sessoesPorFilme/:idFilme", autenticarTokenGestor, sessoesController.sessoesPorFilme);
router.get("/listarSessoesFuturas", autenticarTokenGestor, sessoesController.listarSessoesFuturas);
router.get("/sessaoativa", autenticarTokenGestor, sessoesController.sessaoAtivo);


module.exports = router;
const express = require("express");

const router = express.Router();


const sessoesController = require("../controllers/sessoesController");


const { autenticarTokenCliente, autenticarTokenGestor } = require("../service/token");



// cliente 
router.get("/detalharSessao",  sessoesController.detalhesSessao);
router.get("/sessoesPorFilme/:idFilme", sessoesController.sessoesPorFilme);
router.get("/sessaoativa", sessoesController.sessaoAtivo);




// gestor 
router.get("/listarSessoesFuturas", sessoesController.listarSessoesFuturas);


module.exports = router;


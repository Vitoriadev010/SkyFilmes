const express = require("express");


const router = express.Router();



const sessoesController = require("../controllers/sessoesController");



// todos //
router.get("/detalharSessao",  sessoesController.detalhesSessao);
router.get("/sessoesPorFilme/:idFilme", sessoesController.sessoesPorFilme);
router.get("/sessaoativa", sessoesController.sessaoAtivo);
router.get("/sessao/:idSessao", sessoesController.sessaoId); 
router.get("/listarSessoesFuturas", sessoesController.listarSessoesFuturas);


module.exports = router;


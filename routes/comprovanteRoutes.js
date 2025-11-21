const express = require("express");

const router = express.Router();


const comprovanteController = require("../controllers/comprovanteController");


// chamando a verificação e permissão do token //
const { autenticar } = require("../service/token");

const { permitir } = require("../service/permissao");

// cliente // 
router.get("/cliente/comprovante/:idVenda", autenticar, permitir("cliente"), comprovanteController.gerarComprovante); //cliente


// gestor //
router.get("/gestor/comprovante/:idVenda", autenticar, permitir("gestor"), comprovanteController.gerarComprovante); // gestor
router.get("/gestor/comprovantes", autenticar, permitir("gestor"), comprovanteController.listarComprovantes); //gestor


module.exports = router;


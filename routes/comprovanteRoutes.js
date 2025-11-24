const express = require("express");

const router = express.Router();


const comprovanteController = require("../controllers/comprovanteController");


// chamando a verificação e permissão do token //
const { autenticar } = require("../service/token");

const { permitir } = require("../service/permissao");

// todos //
router.get("comprovante/:idVenda", autenticar, permitir("gestor", "cliente"), comprovanteController.gerarComprovante); 


// gestor // 
router.get("/comprovantes", autenticar, permitir("gestor"), comprovanteController.listarComprovantes); //gestor


module.exports = router;


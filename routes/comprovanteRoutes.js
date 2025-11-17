const express = require("express");

const router = express.Router();


const comprovanteController = require("../controllers/comprovanteController");


const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");

// cliente // 


router.get("/cliente/comprovante/:idVenda",autenticarTokenCliente,comprovanteController.gerarComprovante);


// gestor //

router.get("/gestor/comprovante/:idVenda",autenticarTokenGestor,comprovanteController.gerarComprovante);
router.get("/gestor/comprovantes",autenticarTokenGestor,comprovanteController.listarComprovantes);


module.exports = router;



const express = require("express");
const router = express.Router();
const vendasController = require("../controllers/vendasController");

// chamando a verificação do token


const { autenticarTokenCliente, autenticarTokenGestor } = require("../service/token"); 

router.post("/realizarVenda", autenticarTokenCliente, vendasController.realizarVenda);
router.get("/listarvendas", autenticarTokenGestor, vendasController.listarvendas);

module.exports = router;
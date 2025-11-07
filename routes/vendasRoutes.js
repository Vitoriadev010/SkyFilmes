const express = require("express");
const router = express.Router();
const vendasController = require("../controllers/vendasController");


// chamando a verificação do token
const { autenticarTokenGestor } = require("../service/token");

router.post("/realizarVenda", autenticarTokenGestor, vendasController.realizarVenda);

module.exports = router;
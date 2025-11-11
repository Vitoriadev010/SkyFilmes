
const express = require("express");
const router = express.Router();
const vendasController = require("../controllers/vendasController");

// chamando a verificação do token
const { autenticarTokenGestor } = require("../service/token");
const { autenticarTokenCliente } = require("../service/token");

router.post("/realizarVenda", autenticarTokenGestor, autenticarTokenCliente, vendasController.realizarVenda);
router.get("/vendasCLiente/:idCliente", autenticarTokenCliente, vendasController.vendasPorCLiente);
router.get("/listarVendas", autenticarTokenGestor, vendasController.listarvendas);
router.put("/atualizarVendaStatus/:idVenda", autenticarTokenGestor, vendasController.editarVenda);

module.exports = router;
const express = require("express");

const router = express.Router();


const vendasController = require("../controllers/vendasController");


const { autenticarTokenGestor } = require("../service/token");

const { autenticarTokenCliente } = require("../service/token");

router.get("/listarVendas", autenticarTokenGestor, vendasController.listarvendas);
router.post("/realizarvenda", autenticarTokenCliente, vendasController.realizarvenda);
router.put("/atualizarVendaStatus/:idVenda", autenticarTokenGestor, vendasController.editarVenda);
router.get("/vendasCLiente/:idCliente", autenticarTokenCliente, vendasController.vendasPorCLiente);
router.get("/listarvendaStatus", autenticarTokenGestor, vendasController.listarStatusVendas);


module.exports = router;
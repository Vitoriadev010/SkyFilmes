
const express = require("express");
const router = express.Router();
const vendasController = require("../controllers/vendasController");

// chamando a verificação do token
const { autenticarTokenGestor } = require("../service/token");
const { autenticarTokenCliente } = require("../service/token");


router.post("/realizarvenda", autenticarTokenCliente, vendasController.realizarvenda);
router.get("/vendasCLiente/:idCliente", autenticarTokenCliente, vendasController.vendasPorCLiente);
<<<<<<< HEAD
router.get("/listarvendas", autenticarTokenGestor, vendasController.listarvendas);
=======
router.get("/listarVendas", autenticarTokenGestor, vendasController.listarvendas);
router.put("/atualizarVendaStatus/:idVenda", autenticarTokenGestor, vendasController.editarVenda);
>>>>>>> 522f3e051cfa72612ae16bdb8656a1872dbdb584

module.exports = router;
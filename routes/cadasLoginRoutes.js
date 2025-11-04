const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const gestorController = require("../controllers/gestorController");

// chamando a verificação do token
const { autenticarToken } = require("../service/token");

// // cliente cadastra-se e loga-se//
router.post("/cadastrarCliente", clienteController.cadastrarCliente);
router.post("/logarCliente", clienteController.logarCliente);

// // gestor cadastra-se e loga-se //
router.post("/cadastrarGestor", gestorController.cadastrarGestor);
router.post("/logarGestor", gestorController.logarGestor);
router.get("/listarClientes", autenticarToken, clienteController.listarClientes);

module.exports = router;


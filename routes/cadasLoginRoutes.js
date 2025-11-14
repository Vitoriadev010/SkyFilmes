const express = require("express");

const router = express.Router();


const gestorController = require("../controllers/gestorController");
const clienteController = require("../controllers/clienteController");



// chamando a verificação do token
const { autenticarTokenGestor } = require("../service/token");


// // cliente cadastra-se e loga-se//
router.post("/logarCliente", clienteController.logarCliente);
router.post("/cadastrarCliente", clienteController.cadastrarCliente);

// // gestor cadastra-se e loga-se //
router.post("/logarGestor", gestorController.logarGestor);
router.post("/cadastrarGestor", gestorController.cadastrarGestor);
router.get("/listarClientes", autenticarTokenGestor, clienteController.listarClientes);

module.exports = router;


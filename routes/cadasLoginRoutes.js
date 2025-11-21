const express = require("express");

const router = express.Router();


const gestorController = require("../controllers/gestorController");
const clienteController = require("../controllers/clienteController");



// chamando a verificação e permissão do token //
const { autenticar } = require("../service/token");

const { permitir } = require("../service/permissao");


// // cliente cadastra-se e loga-se//
router.post("/logarCliente", clienteController.logarCliente);
router.post("/cadastrarCliente", clienteController.cadastrarCliente);


// // gestor cadastra-se e loga-se //
router.post("/logarGestor", gestorController.logarGestor);
router.post("/cadastrarGestor", gestorController.cadastrarGestor);


// gestor ver clientes //
router.get("/listarClientes", autenticar, permitir("gestor"), clienteController.listarClientes);
router.get("/clienteativo", autenticar, permitir("gestor"), clienteController.ClienteAtivo);

module.exports = router;


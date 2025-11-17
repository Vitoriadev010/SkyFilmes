const express = require("express");

const router = express.Router();

const salasController = require("../controllers/salasController");


const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");

// cliente
router.get("/:id", autenticarTokenCliente, salasController.ListarSalaPorID); // todos
router.get("/listarsalas", autenticarTokenCliente,salasController.listarSalas); // todos
router.get("/salaativa", autenticarTokenCliente, salasController.salasAtiva);


// gestor 
router.patch("/:id", autenticarTokenGestor, salasController.atualizarSala); // admin
router.post("/adicionarsala", autenticarTokenGestor, salasController.adicionarSala); // admin
router.get("/:id", autenticarTokenGestor, salasController.ListarSalaPorID); // todos
router.get("/listarsalas", autenticarTokenGestor, salasController.listarSalas); // todos
router.get("/salaativa", autenticarTokenGestor, salasController.salasAtiva);


module.exports = router;
const express = require("express");
const router = express.Router();
const salasController = require("../controllers/salasController");

// chamando a verificação do token
const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");

// comandos das salas **ADMIN** //

router.post("/adicionarsala", autenticarTokenGestor, salasController.adicionarSala); // admin
router.patch("/:id", autenticarTokenGestor, salasController.atualizarSala); // admin
router.get("/listarsalas", autenticarTokenCliente, autenticarTokenGestor, salasController.listarSalas); // todos
router.get("/:id", autenticarTokenCliente, autenticarTokenCliente, salasController.ListarSalaPorID); // todos

module.exports = router;
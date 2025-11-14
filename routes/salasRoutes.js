const express = require("express");

const router = express.Router();

const salasController = require("../controllers/salasController");


const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");

router.patch("/:id", autenticarTokenGestor, salasController.atualizarSala); // admin
router.post("/adicionarsala", autenticarTokenGestor, salasController.adicionarSala); // admin
router.get("/:id", autenticarTokenCliente, autenticarTokenCliente, salasController.ListarSalaPorID); // todos
router.get("/listarsalas", autenticarTokenCliente, autenticarTokenGestor, salasController.listarSalas); // todos


module.exports = router;
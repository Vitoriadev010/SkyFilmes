const express = require("express");
const router = express.Router();
const salasController = require("../controllers/salasController");

// chamando a verificação do token
const { autenticarToken } = require("../service/token");

// comandos das salas **ADMIN** //

router.post("/adicionarsala", autenticarToken, salasController.adicionarSala); // admin
router.patch("/:id", autenticarToken, salasController.atualizarSala); // admin
router.get("/listarsalas", autenticarToken, salasController.listarSalas); // admin
router.get("/:id", salasController.ListarSalaPorID); // cliente
router.delete("/:id", autenticarToken, salasController.deletarSala); // admin

module.exports = router;
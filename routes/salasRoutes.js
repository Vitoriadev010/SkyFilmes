const express = require("express");
const router = express.Router();
const salasController = require("../controllers/salasController");

// chamando a verificação do token
const { autenticarToken } = require("../service/token");

// comandos das salas **ADMIN** //

router.post("/adicionarsala", autenticarToken, salasController.adicionarSala);
router.patch("/:id", autenticarToken, salasController.atualizarSala);
router.get("/listarsalas", autenticarToken, salasController.listarSalas);
router.delete("/:id", autenticarToken, salasController.deletarSala);

module.exports = router;
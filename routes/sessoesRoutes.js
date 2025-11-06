const express = require("express");
const router = express.Router();
const sessoesController = require("../controllers/sessoesController");

// chamando a verificação do token
const { autenticarTokenGestor } = require("../service/token");

// rotas para sessões - gestor //
router.post("/criarSessao", autenticarTokenGestor, sessoesController.criarSessao);
router.put("/editarSessao", autenticarTokenGestor, sessoesController.editarSessao);
router.get("/listarSessoes", autenticarTokenGestor, sessoesController.listarSessoes);

module.exports = router;
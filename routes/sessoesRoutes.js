const express = require("express");
const router = express.Router();
const sessoesController = require("../controllers/sessoesController");

// chamando a verificação do token
const { autenticarTokenGestor } = require("../service/token");

const { corrigirDataSemFuso } = require("../service/formatarData");

const { validarHora } = require("../service/formatarHora");

// rotas para sessões - gestor //
router.post("/criarSessao", autenticarTokenGestor, corrigirDataSemFuso, validarHora, sessoesController.criarSessao);
router.put("/editarSessao", autenticarTokenGestor, sessoesController.editarSessao);
router.get("/listarSessoes", autenticarTokenGestor, sessoesController.listarSessoes);

module.exports = router;
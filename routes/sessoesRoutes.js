const express = require("express");

const router = express.Router();




const sessoesController = require("../controllers/sessoesController");

const { validarHora } = require("../service/formatarHora");

const { autenticarTokenGestor } = require("../service/token");

const { corrigirDataSemFuso } = require("../service/formatarData");



// rotas para sessões - gestor //
router.put("/editarSessao", autenticarTokenGestor, sessoesController.editarSessao);
router.get("/listarSessoes", autenticarTokenGestor, sessoesController.listarSessoes);
router.get("/listarSessoes", autenticarTokenGestor, sessoesController.listarSessoes);
router.post("/criarSessao", autenticarTokenGestor, corrigirDataSemFuso, validarHora, sessoesController.criarSessao);


module.exports = router;
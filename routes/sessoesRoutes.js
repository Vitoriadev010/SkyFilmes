const express = require("express");

const router = express.Router();




const sessoesController = require("../controllers/sessoesController");

const { validarHora } = require("../service/formatarHora");

const { corrigirDataSemFuso } = require("../service/formatarData");

// chamando a verificação e permissão do token //
const { autenticar } = require("../service/token");

const { permitir } = require("../service/permissao");


// rotas para sessões - gestor //
router.put("/editarSessao", autenticar, permitir("gestor"), sessoesController.editarSessao); //gestor
router.get("/listarSessoes", autenticar, permitir("gestor"), sessoesController.listarSessoes); //gestor
router.post("/criarSessao", autenticar, permitir("gestor"), corrigirDataSemFuso, validarHora, sessoesController.criarSessao); //gestor


module.exports = router;
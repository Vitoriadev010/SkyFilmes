const express = require("express");

const router = express.Router();


const salasCadeiraController = require("../controllers/salasCadeiraController");


// chamando a verificação e permissão do token //
const { autenticar } = require("../service/token");

const { permitir } = require("../service/permissao");


// todos // 
router.get("/listarcadeiras", salasCadeiraController.listarCadeiras); // todos
router.get("/cadeiraativa", salasCadeiraController.cadeiraAtiva); // todos
router.get("/listarcadeiras/:idSala", salasCadeiraController.listarCadeiraId); // todos


// gestor // 
router.post("/adicionarcadeira", autenticar, permitir("gestor"), salasCadeiraController.adicionarCadeira); // admin
router.patch("/atualizarcadeira/:id", autenticar, permitir("gestor"), salasCadeiraController.atualizarCadeira); // admin


module.exports = router;
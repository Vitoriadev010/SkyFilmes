const express = require("express");

const router = express.Router();


const generoController = require("../controllers/generoController");


// chamando a verificação e permissão do token //
const { autenticar } = require("../service/token");

const { permitir } = require("../service/permissao");


// todos //
router.get("/generoativo", generoController.GeneroAtivo); // todos


// cliente // 
router.get("/listargeneros", generoController.listarGeneros); // todos

// gestor // 
router.post("/adicionarGenero", autenticar, permitir("gestor"), generoController.adicionarGenero); // admin
router.patch("/atualizargenero/:id", autenticar, permitir("gestor"), generoController.atualizarGenero); // admin


module.exports = router;
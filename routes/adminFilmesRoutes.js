const express = require("express");

const router = express.Router();


const filmesController = require("../controllers/filmesController");


// chamando a verificação e permissão do token //
const { autenticar } = require("../service/token");

const { permitir } = require("../service/permissao");



// gestor // 
router.patch("/:id", autenticar, permitir("gestor"), filmesController.atualizarFilme); // admin
router.post("/adicionarfilme", autenticar, permitir("gestor"), filmesController.adicionarFilme); // admin
router.post("/criarSessaoEmBreve", autenticar, permitir("gestor"), filmesController.criarSessaoEmBreve); //admin

module.exports = router;
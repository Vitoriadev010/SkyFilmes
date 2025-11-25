const express = require("express");

const router = express.Router();

const salasController = require("../controllers/salasController");


// chamando a verificação e permissão do token //
const { autenticar } = require("../service/token");

const { permitir } = require("../service/permissao");


// todos //
router.get("/buscarsala/:id", salasController.ListarSalaPorID); // todos
router.get("/listarsalas", salasController.listarSalas); // todos
router.get("/salaativa", salasController.salasAtiva); // todos


// gestor 
router.patch("/atualizarsala/:id", autenticar, permitir("gestor"), salasController.atualizarSala); // admin
router.post("/adicionarsala", autenticar, permitir("gestor"), salasController.adicionarSala); // admin


module.exports = router;
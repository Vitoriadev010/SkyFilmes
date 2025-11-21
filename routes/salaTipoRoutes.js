const express = require("express");

const router = express.Router();

const salasTipoController = require("../controllers/salasTipoController");


// chamando a verificação e permissão do token //
const { autenticar } = require("../service/token");

const { permitir } = require("../service/permissao");

// cliente 
router.get("/listartiposalas", salasTipoController.listarTiposSalas); // todos
router.get("/tipoSalaAtivo", salasTipoController.tipoSalaAtivo); //todos


// gestor 
router.patch("/:id", autenticar, permitir("gestor"), salasTipoController.atualizarTipoSala); // gestor
router.post("/adicionartiposala", autenticar, permitir("gestor"), salasTipoController.adicionarTipoSala); // gestor
router.get("/listartiposalas", autenticar, permitir("gestor"), salasTipoController.listarTiposSalas); // gestor


module.exports = router;

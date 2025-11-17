const express = require("express");

const router = express.Router();

const salasTipoController = require("../controllers/salasTipoController");


const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");

// cliente 
router.get("/listartiposalas", autenticarTokenCliente, salasTipoController.listarTiposSalas); // todos
router.get("/tipoSalaAtivo", autenticarTokenCliente, salasTipoController.tipoSalaAtivo);


// gestor 
router.patch("/:id", autenticarTokenGestor, salasTipoController.atualizarTipoSala); // admin 
router.post("/adicionartiposala", autenticarTokenGestor, salasTipoController.adicionarTipoSala); // admin 
router.get("/listartiposalas", autenticarTokenGestor, salasTipoController.listarTiposSalas); // todos
router.get("/tipoSalaAtivo", autenticarTokenCliente, salasTipoController.tipoSalaAtivo);


module.exports = router;

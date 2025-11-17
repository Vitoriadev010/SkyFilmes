const express = require("express");

const router = express.Router();

const salasTipoController = require("../controllers/salasTipoController");


const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");

router.patch("/:id", autenticarTokenGestor, salasTipoController.atualizarTipoSala); // admin 
router.post("/adicionartiposala", autenticarTokenGestor, salasTipoController.adicionarTipoSala); // admin 
router.get("/listartiposalas", autenticarTokenGestor, autenticarTokenCliente, salasTipoController.listarTiposSalas); // todos
router.get("/tipoSalaAtivo", autenticarTokenCliente, autenticarTokenGestor, salasTipoController.tipoSalaAtivo);


module.exports = router;

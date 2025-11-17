const express = require("express");

const router = express.Router();


const salasCadeiraController = require("../controllers/salasCadeiraController");


const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");


// cliente // 
router.get("/listarcadeiras", autenticarTokenCliente, salasCadeiraController.listarCadeiras); // todos
router.get("/cadeiraativa", autenticarTokenCliente, salasCadeiraController.cadeiraAtiva); // todos
router.get("/listarcadeiras/:idSala", autenticarTokenCliente, salasCadeiraController.listarCadeiraId); // todos

// gestor // 

router.get("/listarcadeiras", autenticarTokenGestor, salasCadeiraController.listarCadeiras); // todos
router.get("/cadeiraativa",  autenticarTokenGestor, salasCadeiraController.cadeiraAtiva); // todos
router.post("/adicionarcadeira", autenticarTokenGestor, salasCadeiraController.adicionarCadeira); // admin
router.get("/listarcadeiras/:idSala", autenticarTokenGestor, salasCadeiraController.listarCadeiraId); // todos
router.patch("/atualizarcadeira/:id", autenticarTokenGestor, salasCadeiraController.atualizarCadeira); // admin


module.exports = router;
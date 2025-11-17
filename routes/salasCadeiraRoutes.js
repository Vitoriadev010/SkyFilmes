const express = require("express");

const router = express.Router();


const salasCadeiraController = require("../controllers/salasCadeiraController");


const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");


router.get("/listarcadeiras", autenticarTokenGestor, autenticarTokenCliente, salasCadeiraController.listarCadeiras); // todos
router.get("/cadeiraativa", autenticarTokenCliente, autenticarTokenGestor, salasCadeiraController.cadeiraAtiva); // todos
router.post("/adicionarcadeira", autenticarTokenGestor, autenticarTokenCliente, salasCadeiraController.adicionarCadeira); // admin
router.get("/listarcadeiras/:idSala", autenticarTokenGestor, autenticarTokenCliente, salasCadeiraController.listarCadeiraId); // todos
router.patch("/atualizarcadeira/:id", autenticarTokenGestor, autenticarTokenCliente, salasCadeiraController.atualizarCadeira); // admin


module.exports = router;
const express = require("express");
const router = express.Router();
const salasCadeiraController = require("../controllers/salasCadeiraController");

// verificação token  // 
const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");
const salas = require("../models/salas");

// comandos cadeiras // 


router.post("/adicionarcadeira", autenticarTokenGestor, autenticarTokenCliente, salasCadeiraController.adicionarCadeira); // admin
router.get("/listarcadeiras", autenticarTokenGestor, autenticarTokenCliente, salasCadeiraController.listarCadeiras); // todos
router.get("/listarcadeiras/:idSala", autenticarTokenGestor, autenticarTokenCliente, salasCadeiraController.listarCadeiraId); // todos
router.patch("/atualizarcadeira/:id", autenticarTokenGestor, autenticarTokenCliente, salasCadeiraController.atualizarCadeira); // admin

module.exports = router;
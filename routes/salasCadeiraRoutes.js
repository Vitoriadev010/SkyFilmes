const express = require("express");
const router = express.Router();
const salasCadeiraController = require("../controllers/salasCadeiraController");

// verificação token  // 
const { autenticarToken } = require("../service/token");
const salas = require("../models/salas");

// comandos cadeiras // 


router.post("/adicionarcadeira", autenticarToken, salasCadeiraController.adicionarCadeira); // admin
router.get("/listarcadeiras", salasCadeiraController.listarCadeiras); // todos
router.get("/listarcadeiras/:idSala", salasCadeiraController.listarCadeiraId); // todos
router.patch("/atualizarcadeira/:id", autenticarToken, salasCadeiraController.atualizarCadeira); // admin

module.exports = router;
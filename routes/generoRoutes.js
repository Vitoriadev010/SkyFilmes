const express = require("express");

const router = express.Router();


const generoController = require("../controllers/generoController");


const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");

// livre //
router.get("/generoativo", generoController.GeneroAtivo); // todos


// cliente // 
router.get("/listargeneros", autenticarTokenCliente, generoController.listarGeneros); // todos

// gestor // 
router.delete("/:id", autenticarTokenGestor, generoController.deletarGenero); // admin
router.post("/adicionarGenero", autenticarTokenGestor, generoController.adicionarGenero); // admin
router.patch("/atualizargenero/:id", autenticarTokenGestor, generoController.atualizarGenero); // admin
router.get("/listargeneros", autenticarTokenGestor, generoController.listarGeneros); // todos


module.exports = router;
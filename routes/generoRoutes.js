const express = require("express");

const router = express.Router();


const generoController = require("../controllers/generoController");


const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");


router.delete("/:id", autenticarTokenGestor, generoController.deletarGenero); // admin
router.post("/adicionarGenero", autenticarTokenGestor, generoController.adicionarGenero); // admin
router.patch("/atualizargenero/:id", autenticarTokenGestor, generoController.atualizarGenero); // admin
router.get("/listargeneros", autenticarTokenCliente, autenticarTokenGestor, generoController.listarGeneros); // todos


module.exports = router;
const express = require("express");
const router = express.Router();
const generoController = require("../controllers/generoController");
const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");


router.post("/adicionarGenero", autenticarTokenGestor, generoController.adicionarGenero); // admin
router.get("/listargeneros", autenticarTokenCliente, autenticarTokenGestor, generoController.listarGeneros); // todos
router.patch("/atualizargenero/:id", autenticarTokenGestor, generoController.atualizarGenero); // admin
router.delete("/:id", autenticarTokenGestor, generoController.deletarGenero); // admin


module.exports = router;
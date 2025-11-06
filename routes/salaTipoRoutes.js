const express = require("express");
const router = express.Router();
const salasTipoController = require("../controllers/salasTipoController");

// verificação token  // 
const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");


// comandos dos tipos de sala

router.post("/adicionartiposala", salasTipoController.adicionarTipoSala); // admin 
router.patch("/:id", autenticarTokenGestor, salasTipoController.atualizarTipoSala); // admin 
router.get("/listartiposalas", autenticarTokenGestor, autenticarTokenCliente, salasTipoController.listarTiposSalas); // todos

module.exports = router;

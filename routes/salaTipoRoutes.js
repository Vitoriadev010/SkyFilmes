const express = require("express");
const router = express.Router();
const salasTipoController = require("../controllers/salasTipoController");

// verificação token  // 
const { autenticarToken } = require("../service/token");


// comandos dos tipos de sala **ADMIN** 

router.post("/adicionartiposala", autenticarToken, salasTipoController.adicionarTipoSala); // admin 
router.patch("/:id", autenticarToken, salasTipoController.atualizarTipoSala); // admin 
router.get("/listartiposalas", salasTipoController.listarTiposSalas); // todos

module.exports = router;
 
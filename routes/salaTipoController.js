const express = require("express");
const router = express.Router();
const salasTipoController = require("../controllers/salasTipoController");

// verificação token  // 
const { autenticarToken } = require("../service/token");


// comandos dos tipos de sala **ADMIN** 

router.post("/adicionartiposala", autenticarToken, salasTipoController.adicionarTipoSala);
router.patch("/:id", autenticarToken, salasTipoController.atualizarTipoSala);
router.get("/listartiposalas", autenticarToken, salasTipoController.listarTiposSalas);
router.delete("/:id", autenticarToken, salasTipoController.deletarTipoSala);

module.exports = router;

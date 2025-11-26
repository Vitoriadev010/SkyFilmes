const express = require("express");

const router = express.Router();


const filmesController = require("../controllers/filmesController");


// chamando a verificação e permissão do token //
const { autenticar } = require("../service/token");

const { permitir } = require("../service/permissao");



// todos //
router.get("/listarfilmes", filmesController.listarFilmes); // todos
router.get("/listasfilmesembreve", filmesController.filmesEmBreve); // todos 
router.get("/cartaz", filmesController.listarStatusCartaz); // todos
router.get("/:titulo", filmesController.buscarFilme); //todos
router.get("/listarPorGenero/:idGenero", filmesController.listargenerosFilmes); // todos
router.get("/selecionarIdioma/:idioma", filmesController.selecionarIdioma); // todos




module.exports = router;
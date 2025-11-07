const express = require("express");
const router = express.Router();
const filmesController = require("../controllers/filmesController");

// chamando a verificação do token
const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");

// adicionar filme ao catalogo **ADMIN** //

router.post("/adicionarfilme", autenticarTokenGestor, filmesController.adicionarFilme); // admin
router.patch("/:id", autenticarTokenGestor, filmesController.atualizarFilme); // admin
router.get("/listarfilmes", filmesController.listarFilmes); // todos
router.get("/filme/:id_genero", filmesController.listargenerosFilmes); // todos
router.get("/filme/:titulo", filmesController.buscarFilme); //todos
router.get("/selecionarIdioma/:idioma", filmesController.selecionarIdioma); // todos

module.exports = router;
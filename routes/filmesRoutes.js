const express = require("express");
const router = express.Router();
const filmesController = require("../controllers/filmesController");

// chamando a verificação do token
const { autenticarTokenCliente, autenticarTokenGestor } = require("../service/token");

// adicionar filme ao catalogo **ADMIN** //

router.post("/adicionarfilme", autenticarTokenGestor, filmesController.adicionarFilme); // admin
router.patch("/:id", autenticarTokenGestor, filmesController.atualizarFilme); // admin
router.get("/listarfilmes", filmesController.listarFilmes); // todos
router.get("/filme/:id_genero", autenticarTokenCliente,autenticarTokenGestor, filmesController.listargenerosFilmes); // todos
router.get("/filme/:titulo", autenticarTokenCliente,autenticarTokenGestor, filmesController.buscarFilme); //todos
router.get("/selecionarIdioma/:idioma", autenticarTokenCliente,autenticarTokenGestor, filmesController.selecionarIdioma); // todos

module.exports = router;
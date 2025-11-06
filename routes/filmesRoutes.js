const express = require("express");
const router = express.Router();
const filmesController = require("../controllers/filmesController");

// chamando a verificação do token
const { autenticarTokenGestor, autenticarTokenCliente } = require("../service/token");

// adicionar filme ao catalogo **ADMIN** //

router.post("/adicionarfilme", autenticarTokenGestor, filmesController.adicionarFilme); // admin
router.patch("/:id", autenticarTokenGestor, filmesController.atualizarFilme); // admin
router.get("/listarfilmes", autenticarTokenGestor, autenticarTokenCliente, filmesController.listarFilmes); // todos
router.get("/filme/:id_genero", autenticarTokenGestor, autenticarTokenCliente, filmesController.listargenerosFilmes); // todos
router.get("/filme/:titulo", autenticarTokenGestor, autenticarTokenCliente, filmesController.buscarFilme); //todos
router.get("/selecionarIdioma/:idioma", autenticarTokenGestor, autenticarTokenCliente, filmesController.selecionarIdioma); // todos

module.exports = router;
const express = require("express");
const router = express.Router();
const filmesController = require("../controllers/filmesController");

// chamando a verificação do token
const { autenticarToken } = require("../service/token");

// adicionar filme ao catalogo **ADMIN** //

router.post("/adicionarfilme", autenticarToken, filmesController.adicionarFilme); // admin
router.patch("/:id", autenticarToken, filmesController.atualizarFilme); // admin
router.get("/listarfilmes", autenticarToken, filmesController.listarFilmes); // todos
router.get("/selecionarIdioma/:idioma", autenticarToken, filmesController.selecionarIdioma); // todos

module.exports = router;
const express = require("express");
const router = express.Router();
const filmesController = require("../controllers/filmesController");

// chamando a verificação do token
const { autenticarToken } = require("../service/token");

// adicionar filme ao catalogo **ADMIN** //

router.post("/adicionarfilme", autenticarToken, filmesController.adicionarFilme);
router.patch("/:id", autenticarToken, filmesController.atualizarFilme);
router.get("/listarfilmes", autenticarToken, filmesController.listarFilmes);
router.get("/selecionarIdioma/:idioma", autenticarToken, filmesController.selecionarIdioma);
router.delete("/:id", autenticarToken, filmesController.deletarFilme);

module.exports = router;
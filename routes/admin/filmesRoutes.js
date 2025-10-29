const express = require("express");
const router = express.Router();
const filmesController = require("../../controllers/filmesController");


// adicionar filme ao catalogo **ADMIN** //

router.post("/adicionarfilme", filmesController.adicionarFilme);
router.patch("/:id", filmesController.atualizarFilme);
router.get("/listarfilmes", filmesController.listarFilmes);
router.get("/selecionarIdioma/:idioma", filmesController.selecionarIdioma);
router.delete("/:id", filmesController.deletarFilme);

module.exports = router;
const express = require("express");

const router = express.Router();


const filmesController = require("../controllers/filmesController");


const { autenticarTokenCliente, autenticarTokenGestor } = require("../service/token");


router.get("/listarfilmes", filmesController.listarFilmes); // todos
router.get("/cartaz", filmesController.listarStatusCartaz); // todos
router.patch("/:id", autenticarTokenGestor, filmesController.atualizarFilme); // admin
router.post("/adicionarfilme", autenticarTokenGestor, filmesController.adicionarFilme); // admin
router.post("/criarSessaoEmBreve", autenticarTokenGestor, filmesController.criarSessaoEmBreve); //admin
router.get("/filme/:titulo", autenticarTokenCliente, autenticarTokenGestor, filmesController.buscarFilme); //todos
router.get("/filme/:id_genero", autenticarTokenCliente, autenticarTokenGestor, filmesController.listargenerosFilmes); // todos
router.get("/selecionarIdioma/:idioma", autenticarTokenCliente, autenticarTokenGestor, filmesController.selecionarIdioma); // todos



module.exports = router;
const express = require("express");

const router = express.Router();


const filmesController = require("../controllers/filmesController");


const { autenticarTokenCliente, autenticarTokenGestor } = require("../service/token");


// lsem token  // 
router.get("/listarfilmes", filmesController.listarFilmes);
router.get("/cartaz", filmesController.listarStatusCartaz);

// gestor // 
router.get("/listarfilmes", filmesController.listarFilmes); // todos
router.get("listarstatussituacao", filmesController.listarStatusCartaz); // todos
router.get("/listaFilmesEmBreve", filmesController.filmesEmBreve); //todos
router.get("/cartaz", filmesController.listarStatusCartaz); // todos
router.patch("/:id", autenticarTokenGestor, filmesController.atualizarFilme); // admin
router.post("/adicionarfilme", autenticarTokenGestor, filmesController.adicionarFilme); // admin
router.post("/criarSessaoEmBreve", autenticarTokenGestor, filmesController.criarSessaoEmBreve); //admin

router.get("/filme/:titulo", autenticarTokenGestor, filmesController.buscarFilme); //todos
router.get("/filme/:id_genero", autenticarTokenGestor, filmesController.listargenerosFilmes); // todos
router.get("/selecionarIdioma/:idioma", autenticarTokenGestor, filmesController.selecionarIdioma); // todos

// cliente // 
router.get("/filme/:titulo", autenticarTokenCliente, filmesController.buscarFilme); //todos
router.get("/filme/:id_genero", autenticarTokenCliente, filmesController.listargenerosFilmes); // todos
router.get("/selecionarIdioma/:idioma", autenticarTokenCliente, filmesController.selecionarIdioma); // todos



module.exports = router;
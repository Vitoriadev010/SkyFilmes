const express = require("express");

const router = express.Router();


const filmesController = require("../controllers/filmesController");


// chamando a verificação e permissão do token //
const { autenticar } = require("../service/token");

const { permitir } = require("../service/permissao");


<<<<<<< HEAD

// gestor // 
router.patch("/:id", autenticar, permitir("gestor"), filmesController.atualizarFilme); // admin
router.post("/adicionarfilme", autenticar, permitir("gestor"), filmesController.adicionarFilme); // admin
router.post("/criarSessaoEmBreve", autenticar, permitir("gestor"), filmesController.criarSessaoEmBreve); //admin
=======
// lsem token  // 
router.get("/listarfilmes", filmesController.listarFilmes); 
router.get("/cartaz", filmesController.listarStatusCartaz); 

// gestor // 
router.patch("/:id", autenticarTokenGestor, filmesController.atualizarFilme); // admin
router.post("/adicionarfilme", autenticarTokenGestor, filmesController.adicionarFilme); // admin
router.post("/criarSessaoEmBreve", autenticarTokenGestor, filmesController.criarSessaoEmBreve); //admin
router.get("/filme/:titulo", autenticarTokenGestor, filmesController.buscarFilme); //todos
router.get("/filme/:id_genero", autenticarTokenGestor, filmesController.listargenerosFilmes); // todos
router.get("/selecionarIdioma/:idioma", autenticarTokenGestor, filmesController.selecionarIdioma); // todos
>>>>>>> feature/Livya

// todos //
router.get("/listarfilmes", filmesController.listarFilmes); // todos
router.get("/listasfilmesembreve", filmesController.filmesEmBreve); // todos 
router.get("/cartaz", filmesController.listarStatusCartaz); // todos
router.get("/filme/:titulo", filmesController.buscarFilme); //todos
router.get("/filme/:id_genero", filmesController.listargenerosFilmes); // todos
router.get("/selecionarIdioma/:idioma", filmesController.selecionarIdioma); // todos
router.get("/filme/:titulo", filmesController.buscarFilme); //todos
router.get("/filme/:id_genero", filmesController.listargenerosFilmes); // todos
router.get("/selecionarIdioma/:idioma", filmesController.selecionarIdioma); // todos



module.exports = router;
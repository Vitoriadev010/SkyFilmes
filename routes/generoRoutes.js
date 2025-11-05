const express = require("express");
const router = express.Router();
const generoController = require("../controllers/generoController");
const { autenticarToken } = require("../service/token");
   

router.post("/adicionarGenero",autenticarToken, generoController.adicionarGenero); // admin
router.get("/listargeneros", generoController.listarGeneros); // todos   
router.patch("/:id", autenticarToken, generoController.atualizarGenero); // admin 
router.delete("/:id", autenticarToken, generoController.deletarGenero); // admin


module.exports = router;
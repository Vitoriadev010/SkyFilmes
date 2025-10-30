const express = require("express");
const router = express.Router();
const generoController = require("../controllers/generoController");


router.post("/adicionarGenero", generoController.adicionarGenero);
router.delete("/:id", generoController.deletarGenero);


module.exports = router;
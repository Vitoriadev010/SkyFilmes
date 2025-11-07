
const express = require("express");
const router = express.Router();
const comprovanteController = require("../controllers/comprovanteController");

router.get("/comprovante/:idVenda", comprovanteController.gerarcomprovante);

module.exports = router;

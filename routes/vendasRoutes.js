const express = require("express");

const router = express.Router();


const vendasController = require("../controllers/vendasController");


// chamando a verificação e permissão do token //
const { autenticar } = require("../service/token");

const { permitir } = require("../service/permissao");

// cliente 
router.post("/realizarvenda", autenticar, permitir("gestor", "cliente"), vendasController.realizarvenda); //cliente
router.get("/vendasCLiente/:idCliente", autenticar, permitir("gestor", "cliente"), vendasController.vendasPorCLiente); //cliente



// gestor

router.get("/listarVendas", autenticar, permitir("gestor"), vendasController.listarvendas); //gestor
router.put("/atualizarVendaStatus/:idVenda", autenticar, permitir("gestor"), vendasController.editarVenda); //gestor
router.get("/listarvendaStatus", autenticar, permitir("gestor"), vendasController.listarStatusVendas); //gestor


module.exports = router;
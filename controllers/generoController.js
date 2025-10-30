
const { sequelize, Sequelize } = require(
  "../models/db");
const Filme = require("../models/filmes")(sequelize, Sequelize.DataTypes);
const Genero = require("../models/generos");

//  ======= Adicionar genero ao catalogo (ADMIN) ========

exports.adicionarGenero = async (req, res) => {
    console.log(req.body);

    try {
        let { nome, classificacao } = req.body;

        if (!nome || !classificao)
    }
}

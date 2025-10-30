const { sequelize, Sequelize } = require("../models/db");

// Inicializa os models corretamente
const Filme = require("../models/filmes")(sequelize, Sequelize.DataTypes);
const Genero = require("../models/generos")(sequelize, Sequelize.DataTypes);


//  ======= Adicionar genero ao catalogo (ADMIN) ========

exports.adicionarGenero = async (req, res) => {
    console.log(req.body);

    try {
        let { nome, classificacao } = req.body;

        if (!nome || !classificacao) {
            return res.status(400).send("Faltam campos obrigatorios.");
        }

        const novoGenero = await Genero.create({ nome, classificacao });
        return res.status(201).json(novoGenero);
    } catch (error) {
        console.log ("erro:", error)
        console.error("Erro ao adicionar gênero:", error);
        return res.status(500).send("Erro ao adicionar gênero.");
    }

}

// ======= apagar genero do catalogo (ADMIN) ========

exports.deletarGenero = async (req,res) => {
    const {id} = req.params;

    try {
        const genero = await Genero.findByPk(id);
        if (!genero) {
            return res.status(404).send("Gênero não encontrado.");
        }
        await genero.destroy();
        return res.status(200).send("Gênero deletado com sucesso.");
    } catch (error) {
        console.error("Erro ao deletar gênero:", error);
        return res.status(500).send("Erro ao deletar gênero.");
    }
}


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

};

// ======== listar generos (TODOS) ==========

exports.listarGeneros = async (req, res) => {
    try { 
        const generos = await Genero.findAll();
        return res.status(200).json(generos);
    }catch (error) {
        console.error("erro ao listar generos: ", error);
        return res.status(500).json({ error: "erro ao listar generos!"});


    }
};

 // ======== atualizar gênero (ADMIN) ==========
 
exports.atualizarGenero = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, classificacao } = req.body;

    const jwt = require("jsonwebtoken");
    const { Genero } = require("../models/generos"); // ajusta o nome do model se for diferente
    const SECRET = process.env.JWT_SECRET; // chave JWT do .env

    const authHeader = req.headers.authorization;

    // ===== Verificação do token =====
    if (!authHeader) {
      return res.status(401).json({ erro: "Token não fornecido." });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    let autenticado;
    try {
      autenticado = jwt.verify(token, SECRET);
    } catch (err) {
      console.error(err);
      return res.status(403).json({ erro: "Token inválido ou expirado." });
    }

    console.log("Usuário autenticado:", autenticado);

    // ===== Busca o gênero pelo ID =====
    const genero = await Genero.findByPk(id);
    if (!genero) {
      return res.status(404).json({ erro: "Gênero não encontrado!" });
    }

    // ===== Atualiza os campos =====
    genero.nome = nome || genero.nome;
    genero.classificacao = classificacao || genero.classificacao;

    await genero.save();

    return res.status(200).json({
      mensagem: "Gênero atualizado com sucesso!",
      genero,
    });
  } catch (error) {
    console.error("Erro ao atualizar gênero:", error);
    return res.status(500).json({ erro: "Erro interno ao atualizar gênero." });
  }
};

 


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
};


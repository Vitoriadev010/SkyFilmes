

const { sequelize, Sequelize } = require(
  "../models/db");
const Filme = require("../models/filmes")(sequelize, Sequelize.DataTypes);
const Genero = require("../models/generos");

// token
const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';

// ======= Adicionar filmes ao catálogo (ADMIN) =======

exports.adicionarFilme = async (req, res) => {
  console.log(req.body);
  // adicionando verificação do token
  const authHeader = req.headers.authorization;

  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ erro: 'token inválido ou expirado' });
      }

      console.log(decoded);
      return decoded;
    });

    console.log('gestor:', autenticado);

    // Agora inclui o campo 'idioma'
    let { titulo, idGenero, duracao, sinopse, capa, idioma } = req.body;

    // ======= Validação de campos obrigatórios =======
    if (!titulo || !idGenero || !duracao || !sinopse || !capa) {
      return res.status(400).send("Faltam campos obrigatórios.");
    }

    // Validação do campo idioma (0 = Legendado, 1 = Dublado)
    if (idioma === undefined || (idioma != 0 && idioma != 1)) {
      return res.status(400).send("O campo 'idioma' é obrigatório e deve ser 0 (Legendado) ou 1 (Dublado).");
    }

    // ======= Tratamento de título =======
    titulo = titulo.trim().toLowerCase().replace(/\s+/g, " ");

    // Limite de letras
    const minLetras = 1;
    const maxLetras = 50;
    if (titulo.length < minLetras) {
      return res.status(400).send(`O título deve ter pelo menos ${minLetras} letra.`);
    }
    if (titulo.length > maxLetras) {
      return res.status(400).send(`O título não pode ter mais que ${maxLetras} letras.`);
    }

    // ======= Verificar duplicidade =======
    const filmeExistente = await Filme.findOne({ where: { titulo } });
    if (filmeExistente) {
      return res.status(400).send("Filme já cadastrado.");
    }

    // ======= Criar novo filme =======
    const novoFilme = await Filme.create({
      titulo,
      idGenero,
      duracao,
      sinopse,
      capa,
      idioma
    });

    return res.status(201).json({
      message: "Filme cadastrado com sucesso!",
      filme: novoFilme
    });

  } catch (error) {
    console.error("Erro ao cadastrar filme:", error);
    return res.status(500).send("Erro ao cadastrar o filme.");
  }
};

// ======= Listar todos os filmes (TODOS) =======

exports.listarFilmes = async (req, res) => {
  const authHeader = req.headers.authorization;

  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ erro: 'token inválido ou expirado' });
      }

      console.log(decoded);
      return decoded;
    });
    console.log('gestor:', autenticado);


    const filmes = await Filme.findAll({
      include: [{ model: Genero, attributes: ["nome"] }]
    });
    res.json(filmes);
  } catch (error) {
    console.error("Erro ao listar filmes:", error);
    res.status(500).send("Erro ao listar os filmes.");
  }
};
// ======= Selecionar filmes por idioma (CLIENTE) =======

exports.selecionarIdioma = async (req, res) => {
  const { idioma } = req.params;
  const authHeader = req.headers.authorization;

  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ erro: 'token inválido ou expirado' });
      }

      console.log(decoded);
      return decoded;
    });
    console.log('gestor:', autenticado);

    // Validação do idioma
    if (idioma != 0 && idioma != 1) {
      return res.status(400).send("O idioma deve ser 0 (Legendado) ou 1 (Dublado).");
    }

    // Buscar filmes com o idioma especificado
    const filmes = await Filme.findAll({
      where: { idioma },
      include: [{ model: Genero, attributes: ["nome"] }]
    });

    if (filmes.length === 0) {
      const label = idioma == 0 ? "Legendado" : "Dublado";
      return res.status(404).send(`Nenhum filme encontrado no idioma ${label}.`);
    }

    res.json(filmes);
  } catch (error) {
    console.error("Erro ao buscar filmes por idioma:", error);
    res.status(500).send("Erro ao buscar filmes por idioma.");
  }
};

// ======= Buscar filme por título =======

exports.buscarFilme = async (req, res) => {
  const titulo = req.params.titulo;
  const authHeader = req.headers.authorization;

  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ erro: 'token inválido ou expirado' });
      }

      console.log(decoded);
      return decoded;
    });
    console.log('gestor:', autenticado);

    const filme = await Filme.findOne({
      where: { titulo },
      include: [Genero],
    });

    if (!filme) {
      return res.status(404).send("Filme não encontrado.");
    }

    res.json(filme);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar o filme.");
  }
};

// ======= Listar filmes por gênero =======

exports.listargenerosFilmes = async (req, res) => {
  const { id_genero } = req.params;
  const authHeader = req.headers.authorization;

  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ erro: 'token inválido ou expirado' });
      }

      console.log(decoded);
      return decoded;
    });
    console.log('gestor:', autenticado);

    const filmes = await Filme.findAll({
      where: { id_genero },
      include: [{ model: Genero, attributes: ["nome"] }]
    });

    if (filmes.length === 0) {
      return res.status(404).send("Nenhum filme encontrado para este gênero.");
    }

    res.json(filmes);
  } catch (error) {
    console.error("Erro ao buscar filmes por gênero:", error);
    res.status(500).send("Erro ao buscar filmes por gênero.");
  }
};

// ======= Atualizar filme (ADMIN) =======

exports.atualizarFilme = async (req, res) => {
  const { id } = req.params;
  const { titulo, id_genero, classificacao, duracao, sinopse, capa, idioma } = req.body;
  const authHeader = req.headers.authorization;

  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ erro: 'token inválido ou expirado' });
      }

      console.log(decoded);
      return decoded;
    });
    console.log('gestor:', autenticado);

    const filme = await Filme.findByPk(id);
    if (!filme) {
      return res.status(404).send("Filme não encontrado.");
    }

    if (titulo) {
      if (titulo.trim().length < 2)
        return res.status(400).send("Título muito curto.");
      filme.titulo = titulo.trim();
    }

    if (id_genero) filme.id_genero = id_genero;
    if (classificacao) filme.classificacao = classificacao;
    if (duracao) filme.duracao = duracao;
    if (sinopse) filme.sinopse = sinopse;
    if (capa) filme.capa = capa;
    if (idioma !== undefined && (idioma == 0 || idioma == 1)) filme.idioma = idioma;

    await filme.save();

    res.status(200).json({ message: "Filme atualizado com sucesso!", filme });
  } catch (error) {
    console.error("Erro ao atualizar filme:", error);
    res.status(500).send("Erro ao atualizar o filme.");
  }
};

// ======= Deletar filme (ADMIN) =======

exports.deletarFilme = async (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;

  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;


    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ erro: 'token inválido ou expirado' });
      }

      console.log(decoded);
      return decoded;
    });
    console.log('gestor:', autenticado);

    const filme = await Filme.findByPk(id);

    if (!filme) {
      return res.status(404).send("Filme não encontrado.");
    }

    await filme.destroy();

    return res.status(200).json({
      message: "Filme deletado com sucesso!",
      filmeDeletado: filme
    });

  } catch (error) {
    console.error("Erro ao deletar filme:", error);
    return res.status(500).send("Erro ao deletar o filme.");
  }
};



const { where } = require("sequelize");
const { sequelize, Sequelize } = require("../models/db");

const initModels = require("../models/init-models");
const models = initModels(sequelize, Sequelize.DataTypes);
const Filme = models.filmes;



// token
const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';


// adicionar filme ADMIN //

exports.adicionarFilme = async (req, res) => {

  console.log(req.body);

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


    let { titulo, idGenero, duracao, sinopse, capa, idioma, statusSituacao } = req.body;


    if (!titulo || !idGenero || !duracao || !sinopse || !capa || !statusSituacao) {
      return res.status(400).send("Faltam campos obrigatórios.");
    }

    // legendado: 0
    // dublado: 1


    if (idioma === undefined || (idioma != 0 && idioma != 1)) {
      return res.status(400).send("O campo 'idioma' é obrigatório e deve ser 0 (Legendado) ou 1 (Dublado).");
    }

    // ======= Tratamento de título =======

    titulo = titulo.trim().toLowerCase().replace(/\s+/g, " ");


    const minLetras = 1;
    const maxLetras = 50;
    if (titulo.length < minLetras) {
      return res.status(400).send(`O título deve ter pelo menos ${minLetras} letra.`);
    }
    if (titulo.length > maxLetras) {
      return res.status(400).send(`O título não pode ter mais que ${maxLetras} letras.`);
    }


    const filmeExistente = await Filme.findOne({ where: { titulo } });
    if (filmeExistente) {
      return res.status(400).send("Filme já cadastrado.");
    }


    const novoFilme = await Filme.create({
      titulo,
      idGenero,
      duracao,
      sinopse,
      capa,
      idioma,
      statusSituacao
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

  try {

    const filmes = await models.filmes.findAll({
      include: [
        {
          model: models.generos, as: 'idGenero_genero'
        }
      ]
    });
    res.json(filmes);
  } catch (error) {
    console.error("Erro ao listar filmes:", error);
    res.status(500).send("Erro ao listar os filmes.");
  }
};



// listar filmes por status //
// status situação: 1 - cartaz; 2 - em breve; 3- desativo

exports.listarStatusCartaz = async (req, res) => {
  try {
    // const { statusSituacao } = req.params; // pega o valor da URL


    const filmes = await models.filmes.findAll({
      where: { statusSituacao: 1 },
      attributes: ['titulo', 'sinopse', 'duracao', 'capa', 'trailler', 'idioma'],
      include: [
        {
          model: models.generos,
          as: 'idGenero_genero'
        }
      ]
    });

    res.json(filmes);
  } catch (error) {
    console.error("Erro ao listar filmes por status:", error);
    res.status(500).send("Erro ao listar os filmes.");
  }
};

// criar sessão em breve de acordo com os filmes que estão com status 2 

// função para validar a data de lançamento
const validarDataEmBreve = require('../service/validarDataEmBreve');

exports.criarSessaoEmBreve = async (req, res) => {
  const authHeader = req.headers.authorization;

  const { idFilme, dataLancamento } = req.body;

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

    if (!idFilme || !dataLancamento) {
      return res.status(400).json({
        erro: 'idFilme e dataLancamento são obrigatórios'
      });
    };

    const validacaoData = validarDataEmBreve(dataLancamento);

    if (!validacaoData.valido) {
      return res.status(400).json({ erro: validacaoData.mensagem });
    }

    const filme = await models.filmes.findOne({
      where: { idFilme }
    });

    if (!filme) {
      return res.status(404).json({ erro: "Filme não encontrado." });
    }

    const existente = await models.emBreve.findOne({
      where: { idFilme }
    });

    if (existente) {
      return res.status(400).json({
        erro: "Este filme já está cadastrado na seção 'em breve'."
      });
    }

    if (filme.statusSituacao !== 2) {
      return res.status(400).json({
        erro: "Este filme não está com status 2 (em breve)."
      });
    }

    const novoRegistro = await models.emBreve.create({
      idFilme,
      dataLancamento: dataLancamento
    });

    const registroCompleto = await models.emBreve.findOne({
      where: {
        idEmBreve: novoRegistro.idEmBreve
      },
      include: [
        {
          model: models.filmes,
          as: 'idFilme_filme'
        }
      ]
    })

    return res.status(201).json({
      mensagem: "Sessão 'em breve' criada com sucesso!",
      registro: registroCompleto
    });
  } catch (error) {
    console.error("erro ao criar:", error);
  }
}

// listar filmes que serã lançados em breve

exports.filmesEmBreve = async (req, res) => {

  try {
    const filmesEmBreve = await models.emBreve.findAll({
      include: [
        {
          model: models.filmes,
          as: 'idFilme_filme',
          include: [
            {
              model: models.generos,
              as: 'idGenero_genero'
            }
          ]
        }
      ]
    });

    return res.status(201).json(filmesEmBreve);
  } catch (error) {
    console.error("erro ao listar:", error);
  }
}

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


    // valida o idioma em //

    if (idioma != 0 && idioma != 1) {
      return res.status(400).send("O idioma deve ser 0 (Legendado) ou 1 (Dublado).");
    }


    const filmes = await models.filmes.findAll({
      where: { idioma },
      include: [{ model: Genero, as: "idGenero_genero", attributes: ["nome"] }]
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

// ======= Buscar filme por título (TODOS) =======

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

    const filme = await filme.findOne({
      where: { titulo },
      include: [{ model: Genero, as: "idGenero_genero", attributes: ["nome"] }]
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

// ======= Listar filmes por gênero (TODOS) =======

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

    const filmes = await models.filmes.findAll({
      where: { id_genero },
      include: [{ model: Genero, as: "idGenero_genero", attributes: ["nome"] }]
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
  const { titulo, id_genero, classificacao, duracao, sinopse, capa, idioma, status, statusSituacao } = req.body;
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

    const filme = await filme.findByPk(id);
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
    if (status !== undefined && ![0, 1].includes(status)) {
      return res.status(400).send("Status inválido. Use 0 para inativo e 1 para ativo.");
    } // em vez de deletar, apenas atualizar status
    if (statusSituacao !== undefined && ![0, 1].includes(statusSituacao)) {
      return res.status(400).send("Status inválido. Use 1 para cartaz, 2 para em breve e 3 para indisponivel!."); filme.statusSituacao = statusSituacao;
    }
    await filme.save();

    res.status(200).json({ message: "Filme atualizado com sucesso!", filme });
  } catch (error) {
    console.error("Erro ao atualizar filme:", error);
    res.status(500).send("Erro ao atualizar o filme.");
  }
};


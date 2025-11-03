const { sequelize, Sequelize } = require("../models/db");

// Inicializa os models corretamente
const salasController = require("../models/salas")(sequelize, Sequelize.DataTypes);

// ======== Adicionar tipo de sala (ADMIN) ========

exports.adicionarTipoSala = async (req, res) => {
    try {
        const { nome, descricao } = req.body;

        const novoTipoSala = await salasController.create({
            nome,
            descricao
        });

        return res.status(201).json(novoTipoSala);
    } catch (error) {
        console.error("Erro ao adicionar tipo de sala:", error);
        return res.status(500).json({ error: "Erro ao adicionar tipo de sala" });
    }
};

// ======== atualizar tipo de sala (ADMIN) =========

exports.atualizarTipoSala = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  const authHeader = req.headers.authorization;

  try {
    // ===== Verificação do token =====
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ erro: "Token inválido ou expirado." });
      }

      console.log(decoded);
      return decoded;
    });

    console.log("gestor:", autenticado);

    // ===== Busca o tipo de sala pelo ID =====
    const tipoSala = await salasTipo.findByPk(id);
    if (!tipoSala) {
      return res.status(404).json({ error: "Tipo de sala não encontrado." });
    }

    // ===== Atualiza os campos =====
    if (nome) tipoSala.nome = nome;
    if (descricao) tipoSala.descricao = descricao;

    // ===== Salva =====
    await tipoSala.save();

    return res
      .status(200)
      .json({ message: "Tipo de sala atualizado com sucesso!", tipoSala });
  } catch (error) {
    console.error("Erro ao atualizar tipo de sala:", error);
    return res
      .status(500)
      .json({ error: "Erro ao atualizar tipo de sala." });
  }
};
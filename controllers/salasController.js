const { sequelize, Sequelize } = require("../models/db");

const salas = require("../models/salas")(sequelize, Sequelize.DataTypes);

// ======== Adicionar sala (ADMIN) =========

exports.adicionarSala = async (req, res) => {

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

       let  { idFilme, idSalasTipo, numero } = req.body;

        const novaSala = await salas.create({
            idFilme,
            idSalasTipo,
            numero
        });

        return res.status(201).json(novaSala);

    } catch (error) {
        console.error("erro ao adicionar nova sala:", error);
        return res.status(500).json({error: "erro ao adicionar nova sala!"});
    }

};

// ======= Listar salas (ADMIN) ==========

exports.listarSalas = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    // Extrai o token do header
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    // Verifica o token JWT
    const decoded = jwt.verify(token, SECRET);
    console.log('Gestor autenticado:', decoded);

    // Busca todas as salas
    const todasSalas = await salas.findAll();
    return res.status(200).json(todasSalas);

  } catch (error) {
    console.error('Erro ao listar salas:', error);

    // Tratamento específico pra token inválido/expirado
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ erro: 'Token inválido ou expirado' });
    }

    // Caso o erro venha do banco
    return res.status(500).json({ erro: 'Erro interno ao listar salas' });
  }
};

// ======= Listar sala por ID (TODOS) ==========

exports.ListarSalaPorID = async (req, res) => {
    try {
        const { id } = req.params;

        const sala = await salas.findByPk(id);

        if (!sala) {
            return res.status(404).json({ error: "sala não encontrada!" });
        }

        return res.status(200).json(sala);
    } catch (error) {
        console.error("erro ao buscar sala por ID:", error);
        return res.status(500).json({ error: "erro ao buscar sala por ID!" });
    }
};


// ======== Atualizar sala (ADMIN) =========

exports.atualizarSala = async (req,res) => {

    try {
        const {id} = req.params;
        const {idFilme, idSalasTipo, numero} = req.body;

        const jwt = require("jsonwebtoken");
const { salas } = require("../models/salas/salas");
const SECRET = process.env.JWT_SECRET; // ou o que estiver configurado no seu projeto

exports.atualizarSala = async (req, res) => {
  const authHeader = req.headers.authorization;

  try {
    // ===== Verificação do token =====
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ erro: 'Token inválido ou expirado.' });
      }
      console.log(decoded);
      return decoded;
    });

    console.log("gestor:", autenticado);

    // ===== Pega o ID da sala =====
    const { id } = req.params;
    const { idFilme, idSalasTipo, numero } = req.body;

    // ===== Verifica se a sala existe =====
    const sala = await salas.findByPk(id);
    if (!sala) {
      return res.status(404).send("Sala não encontrada.");
    }

    // ===== Validações =====
    if (numero) {
      if (numero <= 0)
        return res.status(400).send("Número de sala inválido.");
      sala.numero = numero;
    }

    if (idFilme) sala.idFilme = idFilme;
    if (idSalasTipo) sala.idSalasTipo = idSalasTipo;

    // ===== Salva =====
    await sala.save();

    return res.status(200).json({
      message: "Sala atualizada com sucesso!",
      sala,
    });

  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    return res.status(500).send("Erro ao atualizar a sala.");
  }
}} catch (error) {
    console.error("erro ao atualizar a sala", error);
    return res.status(500).json({error: "erro ao atualizar a sala!"});
}
};


// ======== Deletar sala (ADMIN) =========

exports.deletarSala = async (req, res) => {

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


      const sala = await salas.findByPk(id);

      if (!sala) {
        return res.status(404).send("sala nao encontrada!");
       }

       await sala.destry();

       return res.status(200).json({
        message: "sala deletada com sucesso!",
        sala: sala
       });

      }catch (error) {
        console.error("erro ao deletar sala:", error);
        return res.status(500).send("erro ao deletar a sala!");
      }
};
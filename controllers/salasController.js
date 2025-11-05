// controllers/salasController.js

const { sequelize, Sequelize } = require("../models/db");
const initModels = require("../models/init-models");
const models = initModels(sequelize, Sequelize.DataTypes);

const jwt = require('jsonwebtoken');
const SECRET = 'APIbilheteria';


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

        // CORRIGIDO: Removido 'idFilme' do corpo, pois não existe no model 'salas.js'
        let  { idSalasTipo, numero } = req.body;

        const novaSala = await models.salas.create({
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
    return res.status(401).json({ erro: 'Token não enviado' });
  }

  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ erro: 'Token inválido ou expirado.' });
      }
      return decoded;
    });

    console.log('gestor:', autenticado);

    const todasSalas = await models.salas.findAll(); // USANDO models.salas CORRETAMENTE
    return res.status(200).json(todasSalas);

  } catch (error) {
    console.error("erro ao listar salas:", error);
    return res.status(500).json({ erro: "Erro interno ao listar salas" });
  }
};


// ======= Listar sala por ID (CLIENTE) ==========
// Função original: ListarSalaPorID. Corrigido para retornar o dado.

exports.ListarSalaPorID = async (req, res) => {
    try {
        const { id } = req.params;

        const sala = await models.salas.findByPk(id, {
            // Inclui o tipo de sala para dar mais detalhes ao cliente
            include: [
                { model: models.salasTipo, as: 'idSalasTipo_salasTipo' }
            ]
        });

        if (!sala) {
            return res.status(404).json({ error: "Sala não encontrada!" });
        }
        
        return res.status(200).json(sala); // CORRIGIDO: Retornando o resultado

    } catch (error) {
        console.error("Erro ao buscar sala por ID:", error);
        return res.status(500).json({ error: "Erro ao buscar sala por ID!" });
    }
};


// ======== Atualizar sala (ADMIN) =========
// Conflito de merge/duplicação de código resolvido.

exports.atualizarSala = async (req, res) => {
  const authHeader = req.headers.authorization;

  try {
    // ===== Verificação do token (Mantida conforme seu código original) =====
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
    
    if(!autenticado) {
        return; 
    }

    console.log("gestor:", autenticado);

    // ===== Pega o ID da sala =====
    const { id } = req.params;
    
    // Seu model não usa 'idFilme'
    const { idSalasTipo, numero, status } = req.body; 

    // ===== Verifica se a sala existe =====
    const sala = await models.salas.findByPk(id); // USANDO models.salas CORRETAMENTE
    if (!sala) {
      return res.status(404).send("Sala não encontrada.");
    }

    // ===== Validações e Atualização =====
    if (numero) {
      if (numero <= 0)
        return res.status(400).send("Número de sala inválido.");
      sala.numero = numero;
    }

    if (idSalasTipo) sala.idSalasTipo = idSalasTipo;
    if (status !== undefined) sala.status = status; // Permite atualizar status

    // ===== Salva =====
    await sala.save();

    return res.status(200).json({
      message: "Sala atualizada com sucesso!",
      sala,
    });

  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    // Trata erro de token expirado
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ erro: 'Token inválido ou expirado' });
    }
    return res.status(500).send("Erro ao atualizar a sala.");
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


      const sala = await models.salas.findByPk(id); // USANDO models.salas CORRETAMENTE

      if (!sala) {
        return res.status(404).send("sala nao encontrada!");
       }

       await sala.destroy(); // CORRIGIDO: Era 'destry'

       return res.status(200).json({
           message: "sala deletada com sucesso!",
           sala: sala
       });

    } catch (error) {
      console.error("erro ao deletar sala:", error);
      return res.status(500).json({error: "erro ao deletar sala!"});
    }
};
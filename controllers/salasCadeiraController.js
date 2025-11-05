// controllers/salasCadeiraController.js

const { sequelize, Sequelize } = require("../models/db");
const initModels = require("../models/init-models");
const models = initModels(sequelize, Sequelize.DataTypes);

const jwt = require('jsonwebtoken'); // Mantido, conforme código original
const SECRET = 'APIbilheteria'; // Mantido, conforme código original


// ========= Adicionar nova cadeira (ADMIN)  =========

exports.adicionarCadeira = async (req, res) => {

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

      // Seu model não usa 'numero', mas vou manter na desestruturação, mas não usar no create.
      let { idSala, fileira, coluna, numero } = req.body; 

      // USANDO models.salasCadeira CORRETAMENTE
      const novaCadeira = await models.salasCadeira.create({
        idSala,
        fileira,
        coluna,
        // numero (Não existe no seu model)
      });

      return res.status(201).json(novaCadeira);
    } catch (error) {
        console.error("erro ao adicionar nova cadeira: ", error);
        return res.status(500).json({error: "erro ao adicionar nova cadeira!"});
    }


};

// ======== Listar cadeiras (TODOS) ===========

exports.listarCadeiras = async (req, res) => {
     try {
        // CORRIGIDO: Era salasController.finAll(), agora é models.salasCadeira.findAll()
        const todasCadeiras = await models.salasCadeira.findAll();

        return res.status(200).json(todasCadeiras);
    } catch (error) {
        console.error("erro ao listar cadeiras: ", error);
        return res.status(500).json({error: "erro ao listar cadeiras!"});

    }
};

// ========== Listar cadeiras por idSala (TODOS) ==========
// Rota original: /listarcadeiras/:idSala. O controller chamava listarCadeiraId.
// Corrigido para buscar por idSala (parâmetro da rota) e retornar o resultado.

exports.listarCadeiraId = async (req, res) => {
    const { idSala } = req.params; // Usando o idSala da rota
    try {
        // CORRIGIDO: Era salasController.findByPk(id), que não funcionaria
        const cadeiras = await models.salasCadeira.findAll({
            where: { idSala: idSala }
        });

        if (!cadeiras || cadeiras.length === 0) {
            return res.status(404).send("Cadeiras não encontradas para a sala informada!");
        }

        return res.status(200).json(cadeiras); // CORRIGIDO: Retornando o resultado
    } catch (error) {
        console.error("erro ao buscar cadeira por id: ", error);
        return res.status(500).json({error: "erro ao buscar cadeira por id!"});

    } 

}


// ======== atualizar cadeira (ADMIN) ==========

exports.atualizarCadeira = async (req, res) => {
    const { id } = req.params;
    const authHeader = req.headers.authorization;

    try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

        const autenticado = jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ erro: 'token inválido ou expirado' });
            }
            return decoded;
        });
        console.log('gestor:', autenticado);

        const cadeira = await models.salasCadeira.findByPk(id); // USANDO models.salasCadeira CORRETAMENTE

        if (!cadeira) {
            return res.status(404).send("Cadeira não encontrada!");
        }

        const { fileira, coluna, status } = req.body;

        if (fileira) cadeira.fileira = fileira;
        if (coluna) cadeira.coluna = coluna;
        if (status !== undefined) cadeira.status = status;

        await cadeira.save();

        return res.status(200).json({
            message: "Cadeira atualizada com sucesso!",
            cadeira: cadeira
        });

    } catch (error) {
        console.error("Erro ao atualizar cadeira: ", error);
        return res.status(500).json({ error: "Erro ao atualizar cadeira!" });
    }
}

// ======== deletar cadeira (ADMIN) ============


exports.deletarCadeira = async (req, res) => {
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

    // CORRIGIDO: Era salasController.findByPk(id), agora é models.salasCadeira.findByPk(id)
    const cadeira = await models.salasCadeira.findByPk(id);

    if (!cadeira) {
        return res.status(404).send("cadeira não encontrada!");

    }

    await cadeira.destroy();

    return res.status(200).json({
        message: "cadeira deletada com sucesso!",
        cadeira: cadeira
    });

  } catch (error) {
    console.error("erro ao deletar cadeira: ", error);
    return res.status(500).json({error: "erro ao deletar cadeira!"});
  }

}
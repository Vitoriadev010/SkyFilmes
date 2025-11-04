const { sequelize, Sequelize } = require("../models/db");

const salasController = require("../models/salas")(sequelize, Sequelize.DataTypes);


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

      let { idSala, fileira, coluna, numero } = req.body;

      const novaCadeira = await salasController.create({

        idSala,
        fileira,
        coluna,
        numero
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

        const todasCadeiras = await salasController.finAll();

        return res.status(200).json(todasCadeiras);
     }catch (error) {

        console.error("error ao listar cadeiras: ", error);
        return res.status(500).json({error: "erro ao listar cadeiras!"});

     }

};

// ========== buscar cadeira por id (TODOS) ==========

exports.buscarCadeiraId = async (req, res) => {
    const { id} = req.params;
    try {
        const cadeira = await salasController.findByPk(id);

        if (!cadeira) {
            return res.status(404).send("cadeira não encontrada!");

        }
    } catch (error) {
        console.error("erro ao buscar cadeira por id: ", error);
        return res.status(500).json({error: "erro ao buscar cadeira por id!"});

    } 

}


// ======== atualizar cadeira (ADMIN) ==========

exports.atualizarCadeira = async (req, res) => {


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

    const cadeira = await salasController.findByPk(id);

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

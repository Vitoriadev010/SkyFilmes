const { where } = require("sequelize");
const { Op } = require("sequelize");
const { sequelize, Sequelize } = require("../models/db");

const initModels = require('../models/init-models');
const models = initModels(sequelize, Sequelize.DataTypes);


// token
const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';


exports.realizarVenda = async (req, res) => {
    console.log('realizando venda');
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

        console.log('cliente:', autenticado);

    

    } catch (error) {
        console.error('Erro ao realizar venda:', error);
    }
}

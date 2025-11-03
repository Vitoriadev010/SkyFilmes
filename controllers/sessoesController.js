const { where } = require("sequelize");
const { sequelize, Sequelize } = require("../models/db");
const sessoes = require("../models/sessoes")(sequelize, Sequelize.DataTypes);

// token
const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';


exports.criarSessao = async (req, res) => {
    const authHeader = req.headers.authorization;
    const { idFilme, idSala, hora, data } = req.body;

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

        const sessaoExistente = await sessoes.findOne({
            where: {
                idFilme: idFilme,
                idSala: idSala,
                hora: hora,
                data: data
            }
        });

        if (sessaoExistente) {
            return res.status(400).json({ erro: 'Sessão já existe para o filme, sala, hora e data informados.' });
        }

        const novaSessao = await sessoes.create({
            idFilme: idFilme,
            idSala: idSala,
            hora: hora,
            data: data
        });

        res.status(201).json({
            mensagem: 'Sessão criada com sucesso',
            sessao: novaSessao
        });
    } catch (error) {
        console.error('Erro ao criar sessão:', error);
    }
}


exports.editarSessao = async (req, res) => {
    const authHeader = req.headers.authorization;
    const { idFilme, idSala, hora, data } = req.body;

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

        const sessao = await sessoes.findOne({
            where: {
                idFilme: idFilme,
                idSala: idSala,
                hora: hora,
                data: data
            }
        });
        console.log(sessao);

        if (!sessao) {
            return res.status(404).json({ erro: 'Sessão não encontrada para o filme, sala, hora e data informados.' });
        }

        sessao.hora = hora ?? sessao.hora;
        sessao.data = data ?? sessao.data;
        sessao.idFilme = idFilme ?? sessao.idFilme;
        sessao.idSala = idSala ?? sessao.idSala;

        await sessao.save();

        res.status(200).json({
            mensagem: 'Sessão atualizada com sucesso',
            sessao: sessao
        });
    } catch (error) {
        console.error('Erro ao editar sessão:', error);
    }
}


exports.deletarSessao = async (req, res) => {
    const authHeader = req.headers.authorization;
    const { idSessao } = req.body;

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

        const sessao = await sessoes.findOne({
            where: {
                idSessao: idSessao
            }
        });

        if (!sessao) {
            return res.status(404).json({ erro: 'Sessão não encontrada para o id informado.' });
        }

        await sessao.destroy();
        res.status(200).json({ mensagem: 'Sessão deletada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar sessão:', error);
    }
}


exports.listarSessoes = async (req, res) => {
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

        const listaSessoes = await sessoes.findAll({
            attributes: ['idSessao', 'idFilme', 'idSala', 'hora', 'data']
        });

        res.status(200).json(listaSessoes);
    } catch (error) {
        console.error('Erro ao listar sessões:', error);
    }
}


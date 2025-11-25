// const { sequelize, Sequelize } = require("../models/db");
// const clientes = require("../models/clientes")(sequelize, Sequelize.DataTypes);


const { sequelize, Sequelize } = require("../models/db");
const initModels = require("../models/init-models");
const models = initModels(sequelize);


// token
const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';




exports.cadastrarCliente = async (req, res) => {
    const { nome, cpf, email, senha } = req.body
    console.log(req.body);

    try {
        if (!nome || !cpf || !email || !senha) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
        }

        if (!/^\d{11}$/.test(cpf)) {
            return res.status(400).json({ erro: "CPF inválido. Deve ter 11 números." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ erro: 'Email inválido: deve conter "@" e terminar com ".com"' });
        }

        if (/\s/.test(senha)) {
            return res.status(400).json({ erro: 'A senha não pode conter espaços' });
        }

        const clienteExistente = await clientes.findOne({
            where: {
                email: email,
                cpf: cpf
            }
        });

        if (clienteExistente) {
            return res.status(400).json({ erro: 'Cliente já cadastrado' });
        }

        const novoCliente = await clientes.create({
            nome: nome,
            cpf: cpf,
            email: email,
            senha: senha
        })

        res.status(201).json({
            mensagem: 'Cliente registrado com sucesso',
            cliente: novoCliente
        });
    } catch (error) {
        console.error('Erro ao registrar cliente:', error);
    }
};

exports.logarCliente = async (req, res) => {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    try {
        const userCliente = await models.clientes.findOne({ 
            where: {
                 nome: nome,
                 senha: senha
                } 
            });

        if (!userCliente) {
            return res.status(401).json({ erro: 'Cliente não encontrado' });
        }

        if (!userCliente || userCliente.senha !== senha) {
            return res.status(401).json({ erro: 'Senha ou email inválidos' });
        }

        const token = jwt.sign(
            {
                idCliente: userCliente.idCliente,
                nome: userCliente.nome,
                role: "cliente"
            },
            SECRET
            // depois colocar tempo de expiração do token
        );

        return res.json({ token });
    } catch (error) {
        console.error('Erro ao fazer login do cliente:', error);
    }
}

// listar todos os clientes (ADMIN) //
exports.listarClientes = async (req, res) => {
    console.log("Usuário logado:", req.user);

    try {


        const lista = await models.clientes.findAll({
            attributes: ['idCliente', 'nome', 'cpf', 'email', 'senha'],
        });
        res.json(lista);

    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
    }
}

// listar todos os clientes com status ativo //

exports.ClienteAtivo = async (req, res) => {
    console.log("Usuário logado:", req.user);

    try {
        const clientesAtivos = await models.clientes.findAll({
            where: { status: 1 }
        });

        res.status(200).json(clientesAtivos);

    } catch (error) {
        console.error("Erro ao listar clientes ativos:", error);
        res.status(500).json({ erro: "Erro ao buscar clientes ativos." });
    }
};


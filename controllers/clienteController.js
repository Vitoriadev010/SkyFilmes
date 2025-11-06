const { sequelize, Sequelize } = require("../models/db");
const clientes = require("../models/clientes")(sequelize, Sequelize.DataTypes);


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
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    try {
        const userCliente = await clientes.findOne({ where: { email: email } });

        if (!userCliente) {
            return res.status(401).json({ erro: 'Cliente não encontrado' });
        }

        if (!userCliente || userCliente.senha !== senha) {
            return res.status(401).json({ erro: 'Senha ou email inválidos' });
        }

        const token = jwt.sign(
            { id: userCliente.idCliente, nome: userCliente.nome },
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

        const lista = await clientes.findAll({
            attributes: ['idCliente', 'nome', 'cpf', 'email', 'senha'],
        });
        res.json(lista);

    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
    }
}

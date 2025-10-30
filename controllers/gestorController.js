const { sequelize, Sequelize } = require("../models/db");
const gestores = require("../models/gestores")(sequelize, Sequelize.DataTypes);

// token
const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';

exports.cadastrarGestor = async (req, res) => {
    const { nomeGestor, cpfGestor, emailGestor, senhaGestor, codigoEmpresarial } = req.body
    const codigoEmpresarialValido = 'GESTOR';

    try {
        if (!nomeGestor || !cpfGestor || !emailGestor || !senhaGestor || !codigoEmpresarial) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
        }

        if (!/^\d{11}$/.test(cpfGestor)) {
            return res.status(400).json({ erro: "CPF inválido. Deve ter 11 números." });
        }


        const gestorExistente = await gestores.findOne({
            where: {
                email: emailGestor,
                cpf: cpfGestor
            }
        });

        if (gestorExistente) {
            return res.status(400).json({ erro: 'Gestor já cadastrado' });
        }
        console.log(gestorExistente);

        const novoGestor = await gestores.create({
            nome: nomeGestor,
            cpf: cpfGestor,
            email: emailGestor,
            senha: senhaGestor,
            codigoEmpresarial: codigoEmpresarial
        })

        if (codigoEmpresarial !== codigoEmpresarialValido) {
            return res.status(403).json({ erro: 'Código empresarial inválido' });
        }
        res.status(201).json({
            mensagem: 'Gestor registrado com sucesso',
            gestor: novoGestor
        });

    } catch (error) {
        console.error('Erro ao registrar gestor:', error);
    }
}

exports.logarGestor = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    try {
        const userGestor = await gestores.findOne({ where: { email: email } });

        if (!userGestor) {
            return res.status(401).json({ erro: 'Gestor não encontrado' });
        }

        if (!userGestor || userGestor.senha !== senha) {
            return res.status(401).json({ erro: 'Senha ou email inválidos' });
        }

        const token = jwt.sign(
            {
                id: userGestor.idGestor,
                Gestor: userGestor.nome
            },
            SECRET
        )

        return res.json({ token });
    } catch (error) {
        console.error('Erro ao fazer login do gestor:', error);
    }
}

// função para permitir quem que deve entrar nas rotas, cliente ou admin, de acordo com o token

function permitir(...rolesPermitidos) {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({ erro: 'Acesso negado' });
        }
        next();
    };
}

module.exports = { permitir };
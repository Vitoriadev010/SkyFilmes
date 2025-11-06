const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';


function autenticarTokenCliente(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if (!authHeader) return res.status(401).json({ erro: 'token não enviado' });

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ erro: 'token inválido ou expirado' });
        }
        req.cliente = decoded;
        next()
    });
}


function autenticarTokenGestor(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if (!authHeader) return res.status(401).json({ erro: 'token não enviado' });

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ erro: 'token inválido ou expirado' });
        }
        req.gestor = decoded;
        next()
    });
}

module.exports = { autenticarTokenCliente, autenticarTokenGestor };

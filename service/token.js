const jwt = require('jsonwebtoken');

const SECRET = 'APIbilheteria';


function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if (!authHeader) return res.status(401).json({ erro: 'token não enviado' });

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ erro: 'token inválido ou expirado' });
        }
        req.user = decoded;
        next()
    });
}


module.exports = { autenticar };

function validarHora(req, res, next) {
    const { hora } = req.body;

    if (!hora) {
        return res.status(400).json({ erro: 'Campo “hora” é obrigatório' });
    }

    // HH:mm 24h
    const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!horaRegex.test(hora)) {
        return res.status(400).json({ erro: 'Formato de hora inválido. Use HH:mm (00‑23:59)' });
    }

    next();
}

module.exports = { validarHora };
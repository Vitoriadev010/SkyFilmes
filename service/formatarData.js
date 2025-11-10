function corrigirDataSemFuso(req, res, next) {
    try {
        let dataStr = req.body.data;
        let ano, mes, dia;

        if (!dataStr) {
            return res.status(400).json({ erro: 'Data não informada' });
        }

        if (dataStr.includes('/')) {
            // D/M/YY
            [dia, mes, ano] = dataStr.split('/').map(Number);
        } else if (dataStr.includes('-')) {
            // YY‑MM‑DD
            [ano, mes, dia] = dataStr.split('-').map(Number);
        } else {
            return res.status(400).json({ erro: 'Formato de data inválido' });
        }

        // Corrigir ano com dois dígitos - tava salvando em 1900s
        if (ano < 100) {
            ano += ano < 50 ? 2000 : 1900;
        }

        if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
            return res.status(400).json({ erro: 'Data inválida' });
        }

        // criando a data sem mexer no fuso
        const dataFormatada = `${ano.toString().padStart(4, '0')}-${mes
            .toString()
            .padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;

        req.body.data = dataFormatada; // ex: "2012-12-10"

        next();
    } catch (error) {
        console.error('Erro ao corrigir data:', error);
        return res.status(400).json({ erro: 'Data inválida' });
    }
}

module.exports = { corrigirDataSemFuso };

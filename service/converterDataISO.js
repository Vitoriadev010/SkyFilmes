


function converterDataISO(dataStr) {
    if (!dataStr) return null;

    // Se já estiver no formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) return dataStr;

    // Tenta converter DD/MM/YYYY
    const partes = dataStr.split('/');
    if (partes.length === 3) {
        const [dia, mes, ano] = partes;
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }

    return null; // formato inválido
}

module.exports = { converterDataISO };
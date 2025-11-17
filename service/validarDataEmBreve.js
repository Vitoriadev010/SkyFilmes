function validarDataEmBreve(dataStr) {

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    if (!regex.test(dataStr)) {
        return { valido: false, mensagem: "Formato inválido. Use dd/mm/yyyy." };
    }

    const [_, dia, mes, ano] = dataStr.match(regex).map(Number);

    const data = new Date(ano, mes - 1, dia);

    const dataValida =
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia;

    if (!dataValida) {
        return { valido: false, mensagem: "Data inexistente." };
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataComparacao = new Date(ano, mes - 1, dia);
    dataComparacao.setHours(0, 0, 0, 0);

    if (dataComparacao < hoje) {
        return {
            valido: false,
            mensagem: "A data não pode ser anterior à data atual."
        };
    }

    return {
        valido: true,
        dataFormatada: dataStr // retorna o mesmo formato (BR)
    };
}

module.exports = validarDataEmBreve;

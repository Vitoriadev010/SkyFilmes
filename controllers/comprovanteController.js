const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const db = require("../models/db");
const vendas = db.sequelize.models.vendas;

exports.gerarcomprovante = async (req, res) => {
    const {idVenda} = req.params;

    try {
        const venda = await vendas.findByPk(idVenda);

        if(!venda) {
            return res.status(404).json({ erro: "Venda não encontrada!"});
        }
        const dirComprovantes = path.join(__dirname, "../comprovantes");
        const arquivoPDF = path.join(dirComprovantes, `comprovante-${idVenda}.pdf`);

        if (!fs.existsSync(dirComprovantes)) {
            fs.mkdirSync(dirComprovantes);
        }
            const urlVisualizacao = `http://localhost:3001/ver-comprovante/${idVenda}`;
            const qrCodeDataUrl = await QRCode.toDataURL(urlVisualizacao);

            const doc = new PDFDocument({margin: 50});
            const stream = fs.createWriteStream(arquivoPDF);
            doc.pipe(stream);

           
    doc.fontSize(20).text("🎬 ClickCine - Comprovante de Compra", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Número da Venda: ${venda.idVenda}`);
    doc.text(`ID Cliente: ${venda.idCliente}`);
    doc.text(`ID Sessão: ${venda.idSessao}`);
    doc.text(`ID Sala: ${venda.idSala}`);
    doc.text(`Quantidade de Ingressos: ${venda.qtde}`);
    doc.text(`Valor Total: R$ ${venda.valorTotal}`);
    doc.text(`Status: ${venda.status === 1 ? "Pago" : "Pendente"}`);
    doc.moveDown();
    doc.fontSize(12).text("Apresente este comprovante na entrada do cinema.");
    doc.moveDown();

    const qrImage = qrCodeDataUrl.split(",")[1];
    const qrBuffer = Buffer.from(qrImage, "base64");
    doc.image(qrBuffer, { fit: [120, 120], align: "center"});

    doc.end();


    stream.on("finish", () => {
        res.setHeader("Content-Type", "application/pdf");
        res.sendFile(arquivoPDF);
    });

}catch (erro) {
    console.error("erro ao gerar comprovante", erro);
    res.status(500).json({erro: "erro ao gerar comprovante!"});
}


     };

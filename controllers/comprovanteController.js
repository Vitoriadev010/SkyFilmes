const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../service/token");

const { sequelize, Sequelize } = require("../models/db");
const initModels = require("../models/init-models");
const models = initModels(sequelize, Sequelize.DataTypes);

const STATUS_PAGO = 2;

module.exports = {
  

  
  async gerarComprovante(req, res) {
    console.log("Usuário logado:", req.user);
    
    const { idVenda } = req.params;

    try {

      const venda = await models.vendas.findByPk(idVenda, {
        include: [
          { model: models.vendasItens, as: "vendasItens" },
          { model: models.sessoes, as: "idSessao_sesso" },
        ],
      });

      if (!venda) {
        return res.status(404).json({ erro: "Venda não encontrada!" });
      }

      if (venda.status !== STATUS_PAGO) {
        return res.status(402).json({ erro: "Venda não paga." });
      }

      const dirComprovantes = path.join(__dirname, "../comprovantes");
      if (!fs.existsSync(dirComprovantes)) {
        fs.mkdirSync(dirComprovantes);
      }

      const arquivoPDF = path.join(dirComprovantes, `comprovante-${idVenda}.pdf`);


      const urlVisualizacao = `http://localhost:3001/ver-comprovante/${idVenda}`;
      const qrCodeDataUrl = await QRCode.toDataURL(urlVisualizacao);

      // Gerando PDF
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(arquivoPDF);
      doc.pipe(stream);

      doc.fontSize(20).text("🎬 ClickCine - Comprovante de Compra", { align: "center" });
      doc.moveDown();

      doc.fontSize(14).text(`Número da Venda: ${venda.idVenda}`);
      doc.text(`Cliente: ${venda.idCliente}`);
      doc.text(`Sessão: ${venda.idSessao}`);
      doc.text(`Sala: ${venda.idSala}`);
      doc.text(`Ingressos: ${venda.qtde}`);
      doc.text(`Valor Total: R$ ${venda.valorTotal}`);
      doc.text(`Status: Pago`);

      doc.moveDown();
      doc.text("Apresente este comprovante na entrada do cinema.");
      doc.moveDown();

      const qrImage = qrCodeDataUrl.split(",")[1];
      const qrBuffer = Buffer.from(qrImage, "base64");
      doc.image(qrBuffer, { fit: [120, 120], align: "center" });

      doc.end();

      stream.on("finish", () => {
        res.setHeader("Content-Type", "application/pdf");
        res.sendFile(arquivoPDF);
      });

    } catch (erro) {
      console.error("Erro ao gerar comprovante:", erro);
      return res.status(500).json({ erro: "Erro ao gerar comprovante." });
    }
  },



  async listarComprovantes(req, res) {
    try {
      const vendas = await models.vendas.findAll({
        where: { status: STATUS_PAGO },
        include: [
          { model: models.vendasItens, as: "vendasItens" },
          { model: models.sessoes, as: "idSessao_sesso" },
        ],
      });

      return res.json(vendas);
    } catch (error) {
      console.error("Erro ao listar comprovantes:", error);
      return res.status(500).json({ erro: "Erro ao listar." });
    }
  },

};

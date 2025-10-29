const db = require("./db");
const Genero = require("./Genero");

const Filmes = db.sequelize.define("filmes", {
idFilme: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  idGenero: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  duracao: {
    type: db.Sequelize.STRING(10),
    allowNull: false
  },
  sinopse: {
    type: db.Sequelize.TEXT,
    allowNull: false
  },
  capa: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  idioma: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    comment: "0: Legendado, 1: Dublado"
  }
});

// Associação
Filmes.belongsTo(Genero, { foreignKey: "id_genero" });

Filmes.sync({ force: false });

module.exports = Filmes;

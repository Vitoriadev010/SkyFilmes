const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('filmes', {
    idFilme: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idGenero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'generos',
        key: 'idGenero'
      }
    },
    Cartaz: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Em_breve:{
      type: DataTypes.STRING(255),
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    sinopse: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    duracao: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    capa: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    idioma: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    statusSituacao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1 - cartaz \r\n2 - em breve \r\n3 - desativo"
    }
  }, {
    sequelize,
    tableName: 'filmes',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idFilme" },
        ]
      },
      {
        name: "idGenero",
        using: "BTREE",
        fields: [
          { name: "idGenero" },
        ]
      },
    ]
  });
};



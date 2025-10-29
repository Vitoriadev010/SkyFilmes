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
    titulo: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    sinopse: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    duracao: {
      type: DataTypes.TIME,
      allowNull: false
    },
    capa: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    idioma: {
      type: DataTypes.STRING(1),
      allowNull: false
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

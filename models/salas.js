const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('salas', {
    ideSala: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idFilme: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'filmes',
        key: 'idFilme'
      }
    },
    idSalasTipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'salasTipo',
        key: 'idSalasTipo'
      }
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'salas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ideSala" },
        ]
      },
      {
        name: "idFilme",
        using: "BTREE",
        fields: [
          { name: "idFilme" },
        ]
      },
      {
        name: "idSalasTipo",
        using: "BTREE",
        fields: [
          { name: "idSalasTipo" },
        ]
      },
    ]
  });
};

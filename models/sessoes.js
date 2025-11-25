const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sessoes', {
    idSessao: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ideSala: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'salas',
        key: 'idSala'
      }
    },
    idFilme: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'filmes',
        key: 'idFilme'
      }
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    idSalasTipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'salasTipo',
        key: 'idSalasTipo'
      }
    }
  }, {
    sequelize,
    tableName: 'sessoes',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idSessao" },
        ]
      },
      {
        name: "ideSala",
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

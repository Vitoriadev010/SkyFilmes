const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('salasCadeira', {
    idSalasCadeira: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idSala: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'salas',
        key: 'ideSala'
      }
    },
    fileira: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    coluna: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    numero: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'salasCadeira',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idSalasCadeira" },
        ]
      },
      {
        name: "idSala",
        using: "BTREE",
        fields: [
          { name: "idSala" },
        ]
      },
    ]
  });
};

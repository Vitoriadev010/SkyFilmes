const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vendasItens', {
    idVendasItem: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idVenda: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vendas',
        key: 'idVenda'
      }
    },
    idSalasCadeira: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'salasCadeira',
        key: 'idSalasCadeira'
      }
    },
    precoUnitario: {
      type: DataTypes.DECIMAL(50,0),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'vendasItens',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idVendasItem" },
        ]
      },
      {
        name: "idSalasCadeira",
        using: "BTREE",
        fields: [
          { name: "idSalasCadeira" },
        ]
      },
      {
        name: "idVenda",
        using: "BTREE",
        fields: [
          { name: "idVenda" },
        ]
      },
    ]
  });
};

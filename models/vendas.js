const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vendas', {
    idVenda: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'idCliente'
      }
    },
    ideSala: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'salas',
        key: 'ideSala'
      }
    },
    idSessao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sessoes',
        key: 'idSessao'
      }
    },
    valorTotal: {
      type: DataTypes.DECIMAL(50,0),
      allowNull: false
    },
    qtde: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'vendas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idVenda" },
        ]
      },
      {
        name: "idCliente",
        using: "BTREE",
        fields: [
          { name: "idCliente" },
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
        name: "idSessao",
        using: "BTREE",
        fields: [
          { name: "idSessao" },
        ]
      },
    ]
  });
};

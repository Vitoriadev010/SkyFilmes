const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('salas', {
    ideSala: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ideSala: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'salasTipo',
        key: 'ideSala'
      }
    },
    numero: {
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
        name: "ideSala",
        using: "BTREE",
        fields: [
          { name: "ideSala" },
        ]
      },
    ]
  });
};

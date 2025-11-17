const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emBreve', {
    idEmBreve: {
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
    dataLancamento: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'emBreve',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idEmBreve" },
        ]
      },
      {
        name: "idFilme",
        using: "BTREE",
        fields: [
          { name: "idFilme" },
        ]
      },
    ]
  });
};

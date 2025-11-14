const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cartaz', {
    idCartaz: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idFilme: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'filmes',
        key: 'idFilme'
      }
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'cartaz',
    timestamps: false,
    indexes: [
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

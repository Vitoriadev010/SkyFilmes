const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('em-breve', {
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
    'data-lacamento': {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'em-breve',
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

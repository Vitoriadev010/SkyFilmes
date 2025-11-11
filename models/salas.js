const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('salas', {
    ideSala: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
<<<<<<< HEAD
    ideSala: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'salasTipo',
        key: 'ideSala'
      }
    },
=======
>>>>>>> 689706760c46a6901a3aa06eac8aad8683e82272
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
<<<<<<< HEAD
      {
        name: "ideSala",
        using: "BTREE",
        fields: [
          { name: "ideSala" },
        ]
      },
=======
>>>>>>> 689706760c46a6901a3aa06eac8aad8683e82272
    ]
  });
};

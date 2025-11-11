const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('salas', {
    ideSala: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
<<<<<<< HEAD
      {
        name: "ideSala",
        using: "BTREE",
        fields: [
          { name: "ideSala" },
        ]
      },
=======
>>>>>>> 522f3e051cfa72612ae16bdb8656a1872dbdb584
    ]
  });
};

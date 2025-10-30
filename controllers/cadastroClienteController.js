const { sequelize, Sequelize } = require("../models/db");
const clientes = require("../models/clientes")(sequelize, Sequelize.DataTypes);
const db = require("./db")

const Genero = db.sequelize.define("genero", {
    id_genero: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    genero: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
        classificacao: {
            type: db.Sequelize.STRING,
            allowNull: false
        }
    
});

Genero.sync({force: false});


module.exports = Genero;
const {Sequelize} = require("sequelize")
const sequelize = new Sequelize(
    "Bilheteria",
    "root",
    "toor",
    {
        host: "192.168.8.148",
        dialect: "mysql"
    }
);

sequelize.authenticate().then(()=> {
    console.log("conectado ao banco de dados com sucesso!");
}).catch((error) => {
    console.log("falha ao conectar ao banco de dados:", error);
});











module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}



/// rota livya: 192.168.8.148 
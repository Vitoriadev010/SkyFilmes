var DataTypes = require("sequelize").DataTypes;
var _clientes = require("./clientes");
var _emBreve = require("./emBreve");
var _filmes = require("./filmes");
var _generos = require("./generos");
var _gestores = require("./gestores");
var _salas = require("./salas");
var _salasCadeira = require("./salasCadeira");
var _salasTipo = require("./salasTipo");
var _sessoes = require("./sessoes");
var _vendas = require("./vendas");
var _vendasItens = require("./vendasItens");

function initModels(sequelize) {
  var clientes = _clientes(sequelize, DataTypes);
  var emBreve = _emBreve(sequelize, DataTypes);
  var filmes = _filmes(sequelize, DataTypes);
  var generos = _generos(sequelize, DataTypes);
  var gestores = _gestores(sequelize, DataTypes);
  var salas = _salas(sequelize, DataTypes);
  var salasCadeira = _salasCadeira(sequelize, DataTypes);
  var salasTipo = _salasTipo(sequelize, DataTypes);
  var sessoes = _sessoes(sequelize, DataTypes);
  var vendas = _vendas(sequelize, DataTypes);
  var vendasItens = _vendasItens(sequelize, DataTypes);

  vendas.belongsTo(clientes, { as: "idCliente_cliente", foreignKey: "idCliente"});
  clientes.hasMany(vendas, { as: "vendas", foreignKey: "idCliente"});
  emBreve.belongsTo(filmes, { as: "idFilme_filme", foreignKey: "idFilme"});
  filmes.hasMany(emBreve, { as: "emBreves", foreignKey: "idFilme"});
  sessoes.belongsTo(filmes, { as: "idFilme_filme", foreignKey: "idFilme"});
  filmes.hasMany(sessoes, { as: "sessos", foreignKey: "idFilme"});
  filmes.belongsTo(generos, { as: "idGenero_genero", foreignKey: "idGenero"});
  generos.hasMany(filmes, { as: "filmes", foreignKey: "idGenero"});
  salasCadeira.belongsTo(salas, { as: "ideSala_sala", foreignKey: "ideSala"});
  salas.hasMany(salasCadeira, { as: "salasCadeiras", foreignKey: "ideSala"});
  sessoes.belongsTo(salas, { as: "ideSala_sala", foreignKey: "ideSala"});
  salas.hasMany(sessoes, { as: "sessos", foreignKey: "ideSala"});
  vendas.belongsTo(salas, { as: "ideSala_sala", foreignKey: "ideSala"});
  salas.hasMany(vendas, { as: "vendas", foreignKey: "ideSala"});
  vendasItens.belongsTo(salasCadeira, { as: "idSalasCadeira_salasCadeira", foreignKey: "idSalasCadeira"});
  salasCadeira.hasMany(vendasItens, { as: "vendasItens", foreignKey: "idSalasCadeira"});
  sessoes.belongsTo(salasTipo, { as: "ideSalasTipo_salasTipo", foreignKey: "ideSalasTipo"});
  salasTipo.hasMany(sessoes, { as: "sessos", foreignKey: "ideSalasTipo"});
  vendas.belongsTo(sessoes, { as: "idSessao_sesso", foreignKey: "idSessao"});
  sessoes.hasMany(vendas, { as: "vendas", foreignKey: "idSessao"});
  vendasItens.belongsTo(vendas, { as: "idVenda_venda", foreignKey: "idVenda"});
  vendas.hasMany(vendasItens, { as: "vendasItens", foreignKey: "idVenda"});

  return {
    clientes,
    emBreve,
    filmes,
    generos,
    gestores,
    salas,
    salasCadeira,
    salasTipo,
    sessoes,
    vendas,
    vendasItens,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

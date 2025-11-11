const cors = require("cors");
const express = require("express");
const morgan = require('morgan');
const app = express();

app.use(morgan('dev')); // 'dev' is a predefined format

app.use(cors());

const FilmesRoutes = require("./routes/filmesRoutes");
const GeneroRoutes = require("./routes/generoRoutes");
const adminFilmesRoutes = require("./routes/filmesRoutes");
const adminGeneroRoutes = require("./routes/generoRoutes");
const gestorCadasLoginRoutes = require("./routes/cadasLoginRoutes");
const sessoesRoutes = require("./routes/sessoesRoutes");
const sessoesClientRoutes = require("./routes/sessoesClientRoutes");
const salasRoutes = require("./routes/salasRoutes");
const salaTipoRoutes = require("./routes/salaTipoRoutes");
const salasCadeiraRoutes = require("./routes/salasCadeiraRoutes");
const comprovanteRoutes = require("./routes/comprovanteRoutes");
const vendasRoutes = require("./routes/vendasRoutes");



app.use(express.json());
app.use('/filmes', FilmesRoutes);
app.use('/genero', GeneroRoutes);
app.use('/adminFilmes', adminFilmesRoutes);
app.use('/adminGenero', adminGeneroRoutes);
app.use('/gestorCadLog', gestorCadasLoginRoutes);
app.use('/adminSessoes', sessoesRoutes);
app.use('/sessoes', sessoesClientRoutes);
app.use('/salas', salasRoutes);
app.use('/salasTipo', salaTipoRoutes);
app.use('/salasCadeira', salasCadeiraRoutes);
app.use('/comprovante', comprovanteRoutes);
app.use('/vendas', vendasRoutes);

app.get('/', (req, res) => {
  res.send('Servidor está funcionando corretamente!');
})

app.listen(3001, "0.0.0.0", () => {
  console.log('Vitoria Linda diz: Servidor rodando na porta 3001');

})
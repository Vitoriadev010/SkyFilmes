const express = require("express");
const app = express();
const cors = require("cors");



const morgan = require('morgan');


app.use(morgan('dev')); // 'dev' is a predefined format


app.use(cors());

const salasRoutes = require("./routes/salasRoutes");
const FilmesRoutes = require("./routes/filmesRoutes");
const GeneroRoutes = require("./routes/generoRoutes");
const vendasRoutes = require("./routes/vendasRoutes");
const sessoesRoutes = require("./routes/sessoesRoutes");
const salaTipoRoutes = require("./routes/salaTipoRoutes");
const adminFilmesRoutes = require("./routes/filmesRoutes");
const adminGeneroRoutes = require("./routes/generoRoutes");
const comprovanteRoutes = require("./routes/comprovanteRoutes");
const salasCadeiraRoutes = require("./routes/salasCadeiraRoutes");
const gestorCadasLoginRoutes = require("./routes/cadasLoginRoutes");
const sessoesClientRoutes = require("./routes/sessoesClientRoutes");






app.use(express.json());
app.use('/salas', salasRoutes);
app.use('/filmes', FilmesRoutes);
app.use('/genero', GeneroRoutes);
app.use('/vendas', vendasRoutes);
app.use('/salasTipo', salaTipoRoutes);
app.use('/adminSessoes', sessoesRoutes);
app.use('/sessoes', sessoesClientRoutes);
app.use('/comprovante', comprovanteRoutes);
app.use('/adminFilmes', adminFilmesRoutes);
app.use('/adminGenero', adminGeneroRoutes);
app.use('/salasCadeira', salasCadeiraRoutes);
app.use('/gestorCadLog', gestorCadasLoginRoutes);




app.get('/', (req, res) => {
  res.send('Servidor está funcionando corretamente!');
})

app.listen(3001, "0.0.0.0", () => {
  console.log('Vitoria Linda diz: Servidor rodando na porta 3001');

})
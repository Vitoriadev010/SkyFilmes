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



app.use(express.json());
app.use(FilmesRoutes);
app.use(GeneroRoutes);
app.use(adminFilmesRoutes);
app.use(adminGeneroRoutes);
app.use(gestorCadasLoginRoutes);
app.use(sessoesRoutes);
app.use(sessoesClientRoutes);
app.use(salasRoutes);
app.use(salaTipoRoutes);
app.use(salasCadeiraRoutes);

app.get('/', (req, res) => {
  res.send('Servidor está funcionando corretamente!');
})

app.listen(3000, "0.0.0.0", () => {
  console.log('Vitoria Linda diz: Servidor rodando na porta 3000');
  
})
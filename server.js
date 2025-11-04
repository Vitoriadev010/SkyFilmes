const express = require("express");
const app = express();


const FilmesRoutes = require("./routes/filmesRoutes");
const GeneroRoutes = require("./routes/generoRoutes");
const adminFilmesRoutes = require("./routes/filmesRoutes");
const adminGeneroRoutes = require("./routes/generoRoutes");
const gestorCadasLoginRoutes = require("./routes/cadasLoginRoutes");
const sessoesRoutes = require("./routes/sessoesRoutes");
const sessoesClientRoutes = require("./routes/sessoesClientRoutes");


app.use(express.json());
app.use(FilmesRoutes);
app.use(GeneroRoutes);
app.use(adminFilmesRoutes);
app.use(adminGeneroRoutes);
app.use(gestorCadasLoginRoutes);
app.use(sessoesRoutes);
app.use(sessoesClientRoutes);

app.listen(3000, () => {
  console.log('Vitoria Linda diz: Servidor rodando na porta 3000');
})
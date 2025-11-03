const express = require("express");
const app = express();


const FilmesRoutes = require("./routes/filmesRoutes");
const GeneroRoutes = require("./routes/generoRoutes");
const adminFilmesRoutes = require("./routes/filmesRoutes");
const adminGeneroRoutes = require("./routes/generoRoutes");
const gestorCadasLoginRoutes = require("./routes/cadasLoginRoutes");



app.use(express.json());
app.use(FilmesRoutes);
app.use(GeneroRoutes);
app.use(adminFilmesRoutes);
app.use(adminGeneroRoutes);
app.use(gestorCadasLoginRoutes);

app.listen(3000, () => {
  console.log('Vitoria Linda diz: Servidor rodando na porta 3000');
})
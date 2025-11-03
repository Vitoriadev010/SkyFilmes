const express = require("express");
const app = express();


const FilmesRoutes = require("./routes/filmesRoutes");
const GeneroRoutes = require("./routes/generoRoutes");



app.use(express.json());
app.use(FilmesRoutes);
app.use(GeneroRoutes);
app.listen(3000, () => {
  console.log('Vitoria Linda diz: Servidor rodando na porta 3000');
})
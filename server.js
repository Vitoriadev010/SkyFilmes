const express = require("express");
const app = express();


const adminFilmesRoutes = require("./routes/admin/filmesRoutes");








app.use(express.json());
app.use(adminFilmesRoutes);

app.listen(3000, () => {
  console.log('Vitoria Linda diz: Servidor rodando na porta 3000');
})
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
<<<<<<< HEAD
const comprovanteRoutes = require("./routes/comprovanteRoutes");
=======
const vendasRoutes = require("./routes/vendasRoutes");
>>>>>>> 245f3853e4827f9149842c6ad85393e1ad387d2f



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
<<<<<<< HEAD
app.use(comprovanteRoutes);

=======
app.use(vendasRoutes);
>>>>>>> 245f3853e4827f9149842c6ad85393e1ad387d2f

app.get('/', (req, res) => {
  res.send('Servidor está funcionando corretamente!');
})

app.listen(3001, "0.0.0.0", () => {
  console.log('Vitoria Linda diz: Servidor rodando na porta 3001');

})
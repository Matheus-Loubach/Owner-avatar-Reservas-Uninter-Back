const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./src/DB/connect.js");

app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

//DB CONNECTION
connectDB();

// Routers
const routes = require("./src/Routes/router.js");
app.use('/api', routes);

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Erro interno do servidor' });
});

app.listen(3000, function () {
    console.log('Servidor Online porta 3000');
});

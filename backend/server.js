const express = require("express");

const app = express();

const usuariosRoutes = require("./routes/usuarios");

app.use(express.json());

app.use("/usuarios", usuariosRoutes);

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

app.get("/saludo", (req, res) => {
    res.send("Saludo a Jaime");
});

app.get("/proyecto", (req, res) => {
    res.send("Sistema de validacion de documento");
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});

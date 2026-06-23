const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const usuariosRoutes = require("./routes/usuarios");
const documentosRoutes = require("./routes/documentos");


app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend")));
app.use("/usuarios", usuariosRoutes);
app.use("/documentos", documentosRoutes);

//app.get("/", (req, res) => {res.send("Servidor funcionando");});

app.get("/saludo", (req, res) => {
    res.send("Saludo a Jaime");
});

app.get("/proyecto", (req, res) => {
    res.send("Sistema de validacion de documento");
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});
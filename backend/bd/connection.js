const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "database",
    user: "root",
    password: "root",
    database: "validacion"
});

connection.connect((err) => {
    if (err) {
        console.error("Error conectando a MySQL:", err.message);
        return;
    }

    console.log("Conectado a MySQL");
});

module.exports = connection;
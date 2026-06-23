const connection = require("../bd/connection");

const obtenerUsuarios = (req, res) => {
    connection.query(
        "SELECT * FROM usuarios",
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);
        }
    );
};

const crearUsuario = (req, res) => {
    const { nombre } = req.body;

    connection.query(
        "INSERT INTO usuarios (nombres) VALUES (?)",
        [nombre],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                mensaje: "Usuario agregado",
                id: result.insertId
            });
        }
    );
};

const actualizarUsuario = (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    connection.query(
        "UPDATE usuarios SET nombres = ? WHERE id = ?",
        [nombre, id],
        (err) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                mensaje: "Usuario actualizado"
            });
        }
    );
};

const eliminarUsuario = (req, res) => {
    const { id } = req.params;

    connection.query(
        "DELETE FROM usuarios WHERE id = ?",
        [id],
        (err) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                mensaje: "Usuario eliminado"
            });
        }
    );
};

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};
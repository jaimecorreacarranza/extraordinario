const connection = require("../bd/connection");
const QRCode = require("qrcode");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

const subirDocumento = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            mensaje: "No se recibió ningún archivo"
        });
    }

    connection.query(
        "INSERT INTO documentos (nombredoc,titulo,tipo,area) VALUES (?,?,?,?)",
        [
    req.file.filename,
    req.body.titulo,
    req.body.tipo,
    req.body.area
],
        async (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            try {

                const idDocumento = result.insertId;

                const urlValidacion =
                    `http://localhost:3001/documentos/validar/${idDocumento}`;

                const qrBuffer =
                    await QRCode.toBuffer(urlValidacion);

                const pdfPath = req.file.path;

                const pdfDoc =
                    await PDFDocument.load(
                        fs.readFileSync(pdfPath)
                    );

                const page =
                    pdfDoc.getPages()[0];

                const qrImage =
                    await pdfDoc.embedPng(qrBuffer);

                const qrDims = qrImage.scale(0.5);

                page.drawImage(qrImage, {
                    x: page.getWidth() - qrDims.width - 20,
                    y: page.getHeight() - qrDims.height - 20,
                    width: qrDims.width,
                    height: qrDims.height
                });

                const pdfBytes =
                    await pdfDoc.save();

                if (!fs.existsSync("pdfs_generados")) {
                    fs.mkdirSync("pdfs_generados");
                }

                const nuevoPDF =
                    `pdfs_generados/validado-${req.file.filename}`;

                fs.writeFileSync(
                    nuevoPDF,
                    pdfBytes
                );

                res.download(nuevoPDF);

            } catch (error) {

                console.log("ERROR:");
                console.log(error);

                res.status(500).json({
                    mensaje: error.message
                });
            }
        }
    );
};

const validarDocumento = (req, res) => {

    const { id } = req.params;

    connection.query(
        "SELECT * FROM documentos WHERE iddocumentos = ?",
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (results.length === 0) {
                return res.status(404).send("Documento no encontrado");
            }

            const documento = results[0];

           res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Validación de Documento</title>

<style>

body{
    font-family: "Segoe UI", Arial, sans-serif;
    background:#f5f5f5;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    margin:0;
}

.card{
    background:white;
    width:500px;
    padding:30px;
    border-radius:12px;
    box-shadow:0 4px 15px rgba(0,0,0,.15);
}

h1{
    text-align:center;
    color:#b71c1c;
    margin-bottom:20px;
}

hr{
    border:none;
    height:2px;
    background:#c62828;
    margin-bottom:20px;
}

.info{
    margin:15px 0;
    font-size:18px;
}

.estado{
    font-weight:bold;
    color:${
        documento.estado === "Revocado"
        ? "#c62828"
        : "#2e7d32"
    };
}

</style>
</head>

<body>

<div class="card">

<h1>🔴 Documento Validado</h1>

<hr>

<div class="info">
<strong>ID:</strong> ${documento.iddocumentos}
</div>

<div class="info">
<strong>Documento:</strong> ${documento.nombredoc}
</div>

<div class="info">
<strong>Estado:</strong>
<span class="estado">
${documento.estado}
</span>
</div>

<div class="info">
<strong>Fecha:</strong>
${new Date(documento.fechaCreacion).toLocaleDateString()}
</div>

</div>

</body>
</html>
`);
        }
    );
};

const listarDocumentos = (req, res) => {

    connection.query(
        "SELECT * FROM documentos",
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);
        }
    );
};

const revocarDocumento = (req, res) => {

    const { id } = req.params;

    connection.query(
        "UPDATE documentos SET estado='Revocado' WHERE iddocumentos=?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                mensaje: "Documento revocado"
            });
        }
    );
};

const cancelarDocumento = (req, res) => {

    const { id } = req.params;

    connection.query(
        "UPDATE documentos SET estado='Cancelado' WHERE iddocumentos=?",
        [id],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                mensaje: "Documento cancelado"
            });
        }
    );
};

module.exports = {
    subirDocumento,
    validarDocumento,
    listarDocumentos,
    revocarDocumento,
    cancelarDocumento
};

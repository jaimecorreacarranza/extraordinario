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
                <h1>Validación de Documento</h1>
                <hr>
                <p><strong>ID:</strong> ${documento.iddocumentos}</p>
                <p><strong>Documento:</strong> ${documento.nombredoc}</p>
                <p><strong>Estado:</strong> ${documento.estado}</p>
                <p><strong>Fecha:</strong> ${documento.fechaCreacion}</p>
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
                <h1>Validación de Documento</h1>
                <hr>
                <p><strong>ID:</strong> ${documento.iddocumentos}</p>
                <p><strong>Documento:</strong> ${documento.nombredoc}</p>
                <p><strong>Estado:</strong> ${documento.estado}</p>
                <p><strong>Fecha:</strong> ${documento.fechaCreacion}</p>
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

module.exports = {
    subirDocumento,
    validarDocumento,
    listarDocumentos,
    revocarDocumento
};


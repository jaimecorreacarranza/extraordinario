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
        "INSERT INTO documentos (nombredoc) VALUES (?)",
        [req.file.filename],
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

                const qrDims =
                    qrImage.scale(0.25);

                page.drawImage(qrImage, {
                    x: page.getWidth() - qrDims.width - 20,
                    y: page.getHeight() - qrDims.height - 20,
                    width: qrDims.width,
                    height: qrDims.height
                });

                const pdfBytes =
                    await pdfDoc.save();

                const nuevoPDF =
                    `pdfs_generados/validado-${req.file.filename}`;

                fs.writeFileSync(
                    nuevoPDF,
                    pdfBytes
                );

                res.download(nuevoPDF);

            } catch (error) {

                console.log(error);

                res.status(500).json({
                    mensaje: "Error generando PDF con QR"
                });
            }
        }
    );
};

module.exports = {
    subirDocumento
};
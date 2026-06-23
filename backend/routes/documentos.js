const express = require("express");
const router = express.Router();

const upload = require("../uploads/multerConfig");

const {
    subirDocumento,
    validarDocumento,
    listarDocumentos,
    revocarDocumento,
    cancelarDocumento
} = require("../controllers/documentosController");

router.post(
    "/upload",
    upload.single("pdf"),
    subirDocumento
);

router.get(
    "/validar/:id",
    validarDocumento
);

router.get(
    "/listar",
    listarDocumentos
);

router.put(
    "/revocar/:id",
    revocarDocumento
);

router.put(
    "/cancelar/:id",
    cancelarDocumento
);

module.exports = router;
const express = require("express");
const router = express.Router();

const upload = require("../uploads/multerConfig");

const {
    subirDocumento
} = require("../controllers/documentosController");

router.post(
    "/upload",
    upload.single("pdf"),
    subirDocumento
);

module.exports = router;
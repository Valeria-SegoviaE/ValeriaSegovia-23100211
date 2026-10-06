const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const carpetaUploads = path.join(__dirname, "../uploads");

fs.mkdirSync(carpetaUploads, { recursive: true });

const almacenamiento = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, carpetaUploads);
    },
    filename: (_req, file, callback) => {
        const nombre = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_");
        callback(null, nombre);
    }
});

const tiposImagenPermitidos = new Set(["image/jpeg", "image/png", "image/webp"]);

const cargarArchivo = multer({
    storage: almacenamiento,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        if (!tiposImagenPermitidos.has(file.mimetype)) {
            const error = new Error("Tipo de imagen no permitido");
            error.status = 400;
            error.publicMessage = "Solo se permiten imágenes JPEG, PNG o WebP.";
            return callback(error);
        }

        callback(null, true);
    }
});

router.post("/", cargarArchivo.single("imagen"), (req, res, next) => {
    if (!req.file) {
        const error = new Error("Falta el archivo de imagen");
        error.status = 400;
        error.publicMessage = "Debes enviar una imagen en el campo 'imagen'.";
        return next(error);
    }

    res.status(201).json({
        mensaje: "Imagen recibida correctamente",
        imagen: {
            nombre: req.file.filename,
            nombreOriginal: req.file.originalname,
            tipo: req.file.mimetype,
            tamano: req.file.size,
            ruta: `/uploads/${req.file.filename}`
        },
        datos: req.body
    });
});

module.exports = router;

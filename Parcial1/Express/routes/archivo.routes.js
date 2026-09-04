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

const cargarArchivo = multer({
    storage: almacenamiento,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post("/", cargarArchivo.fields([
    { name: "archivo", maxCount: 1 },
    { name: "imagen", maxCount: 1 }
]), (req, res) => {
    const archivos = [
        ...(req.files?.archivo || []),
        ...(req.files?.imagen || [])
    ];

    if (archivos.length === 0) {
        return res.status(400).json({
            error: "Debes enviar un archivo en el campo 'archivo' o una imagen en 'imagen'"
        });
    }

    res.status(201).json({
        mensaje: "Archivo recibido correctamente",
        archivos: archivos.map((archivo) => ({
            nombre: archivo.filename,
            nombreOriginal: archivo.originalname,
            tipo: archivo.mimetype,
            tamano: archivo.size,
            ruta: `/uploads/${archivo.filename}`
        })),
        datos: req.body
    });
});

module.exports = router;

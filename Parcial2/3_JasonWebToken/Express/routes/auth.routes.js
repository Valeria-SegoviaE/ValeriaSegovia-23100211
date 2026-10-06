const crypto = require("crypto");
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const compararSeguro = (valor, esperado) => {
    if (typeof valor !== "string" || typeof esperado !== "string") return false;

    const valorBuffer = Buffer.from(valor);
    const esperadoBuffer = Buffer.from(esperado);

    return valorBuffer.length === esperadoBuffer.length
        && crypto.timingSafeEqual(valorBuffer, esperadoBuffer);
};

router.post("/login", (req, res, next) => {
    const { usuario, clave } = req.body || {};

    if (typeof usuario !== "string" || typeof clave !== "string") {
        const error = new Error("Faltan las credenciales");
        error.status = 400;
        error.publicMessage = "Envía usuario y clave en formato JSON.";
        return next(error);
    }

    const usuarioValido = compararSeguro(usuario, process.env.AUTH_USER);
    const claveValida = compararSeguro(clave, process.env.AUTH_PASSWORD);

    if (!usuarioValido || !claveValida) {
        const error = new Error("Credenciales incorrectas");
        error.status = 401;
        error.publicMessage = "Usuario o clave incorrectos.";
        return next(error);
    }

    const expiracion = process.env.JWT_EXPIRES_IN || "1h";
    const token = jwt.sign(
        { usuario: process.env.AUTH_USER },
        process.env.JWT_SECRET,
        { expiresIn: expiracion }
    );

    res.json({
        token,
        tipo: "Bearer",
        expiraEn: expiracion
    });
});

module.exports = router;
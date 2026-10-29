const fs = require("fs");
const path = require("path");
const winston = require("winston");

const carpetaLogs = path.join(__dirname, "../logs");
fs.mkdirSync(carpetaLogs, { recursive: true });

const formatoSeguro = winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    const detalles = Object.keys(metadata).length ? ` ${JSON.stringify(metadata)}` : "";
    return `[${timestamp}] ${level.toUpperCase()} ${message}${detalles}`;
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        formatoSeguro
    ),
    transports: [
        new winston.transports.File({ filename: path.join(carpetaLogs, "errores.log"), level: "error" })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: path.join(carpetaLogs, "excepciones.log") })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: path.join(carpetaLogs, "rechazos.log") })
    ],
    exitOnError: false
});

module.exports = logger;
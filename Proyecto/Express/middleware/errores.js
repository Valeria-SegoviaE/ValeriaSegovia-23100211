const logger = require("../config/logger");

const mensajesPorDefecto = {
    400: "Los datos enviados no son válidos.",
    401: "Debes autenticarte para realizar esta acción.",
    403: "No tienes permisos para realizar esta acción.",
    404: "El recurso solicitado no existe.",
    409: "La operación entra en conflicto con el estado actual del recurso.",
    415: "El formato de la petición no es válido.",
    413: "El archivo enviado supera el tamaño permitido.",
    500: "Ocurrió un error interno del servidor.",
    503: "El servicio no está disponible temporalmente."
};

const obtenerCodigo = (error, status) => {
    if (error.code === "LIMIT_FILE_SIZE") return "ERROR_ARCHIVO_GRANDE";
    if (status === 400) return "ERROR_VALIDACION";
    if (status === 401) return "ERROR_NO_AUTENTICADO";
    if (status === 403) return "ERROR_PERMISOS";
    if (status === 404) return "ERROR_NO_ENCONTRADO";
    if (status === 409) return "ERROR_CONFLICTO";
    if (status === 503) return "ERROR_SERVICIO_NO_DISPONIBLE";
    return "ERROR_INTERNO";
};

const mensajeSeguro = (error, status) => {
    if (error.publicMessage) return error.publicMessage;
    if (status === 413) return "El archivo enviado supera el tamaño permitido.";
    return mensajesPorDefecto[status] || mensajesPorDefecto[500];
};

const redactarDatosSensibles = (valor) => String(valor || "").replace(
    /(password|contraseña|token|secret|api[_-]?key|connectionstring)(\s*[=:]\s*)([^\s,;]+)/gi,
    "$1$2[REDACTADO]"
);

const manejadorErrores = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    const status = err.code === "LIMIT_FILE_SIZE"
        ? 413
        : Number.isInteger(err.statusCode) ? err.statusCode : Number.isInteger(err.status) ? err.status : 500;
    const statusSeguro = status >= 400 && status <= 599 ? status : 500;
    const usuario = req.user && (req.user.id || req.user.usuario || req.user.email) || "No autenticado";

    logger.error(redactarDatosSensibles(err.message || "Error sin mensaje"), {
        usuario,
        metodo: req.method,
        ruta: req.originalUrl,
        status: statusSeguro,
        tipo: err.name || "Error",
        stack: redactarDatosSensibles(err.stack)
    });

    res.status(statusSeguro).json({
        error: {
            status: statusSeguro,
            code: obtenerCodigo(err, statusSeguro),
            message: mensajeSeguro(err, statusSeguro)
        }
    });
};

module.exports = manejadorErrores;
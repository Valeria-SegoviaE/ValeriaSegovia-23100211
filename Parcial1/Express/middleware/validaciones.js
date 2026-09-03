const { EventEmitter } = require("events");

const eventosError = new EventEmitter();

const crearError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    return error;
};

eventosError.on("error", ({ error, req }) => {
    console.error(
        `${new Date().toISOString()} ${req.method} ${req.originalUrl}`,
        error.stack || error.message
    );
});

const rutaNoEncontrada = (req, res, next) => {
    next(crearError("Ruta no encontrada", 404));
};

const horarioPermitido = (horaInicio, horaFin) => (req, res, next) => {
    const horaActual = new Date().getHours();

    if (horaActual < horaInicio || horaActual >= horaFin) {
        return next(crearError("Servicio disponible fuera de horario", 403));
    }

    next();
};

const soloJson = (req, res, next) => {
    const metodosConCuerpo = ["POST", "PUT", "PATCH"];

    if (metodosConCuerpo.includes(req.method) && !req.is("application/json")) {
        return next(crearError("La petición debe utilizar JSON", 415));
    }

    next();
};

const errorHandler = (err, req, res, next) => {
    eventosError.emit("error", { error: err, req });

    const status = err.status || err.statusCode || 500;
    const mensaje = err.message || (status === 404 ? "Recurso no encontrado" : "Algo no ha ido bien");

    res.status(status).json({
        error: mensaje
    });
};

module.exports = {
    crearError,
    rutaNoEncontrada,
    horarioPermitido,
    soloJson,
    errorHandler
};
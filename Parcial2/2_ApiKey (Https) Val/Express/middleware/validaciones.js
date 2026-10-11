const crearError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    return error;
};

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

module.exports = {
    crearError,
    rutaNoEncontrada,
    horarioPermitido,
    soloJson
};
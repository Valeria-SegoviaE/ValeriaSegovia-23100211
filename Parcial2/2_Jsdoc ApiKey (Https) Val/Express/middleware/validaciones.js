const crearError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    return error;
};

const rutaNoEncontrada = (req, res, next) => {
    next(crearError("Ruta no encontrada", 404));
};

/**
 * Crea un middleware que permite solicitudes únicamente dentro de un horario.
 *
 * @author Valeria Segovia
 * @param {number} horaInicio - Hora inicial permitida, de 0 a 23.
 * @param {number} horaFin - Hora final excluida, de 1 a 24.
 * @returns {Function} Middleware de validación del horario.
 * @throws {Error} Reenvía a `next` un error con estado 403 si la solicitud está fuera del horario.
 * @version 1.0.0
 * @since 1.0.0
 * @example
 * const { horarioPermitido } = require("./middleware/validaciones");
 * app.use("/api/usuario", horarioPermitido(7, 15));
 */
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
const { param, query, validationResult } = require("express-validator");

const crearError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    return error;
};

const reglasUsuario = (validarNombre) => [
    validarNombre("nombre")
        .custom((valor) => typeof valor === "string" && valor.trim().length > 0)
        .withMessage("El nombre es obligatorio."),
    query("edad")
        .notEmpty()
        .withMessage("La edad es obligatoria.")
        .bail()
        .isInt({ min: 17, max: 70 })
        .withMessage("La edad debe ser un entero entre 17 y 70."),
    query("carrera")
        .notEmpty()
        .withMessage("La carrera es obligatoria.")
        .bail()
        .custom((valor) => typeof valor === "string" && valor.trim().length > 0)
        .withMessage("La carrera no puede estar vacía.")
        .bail()
        .custom((valor) => typeof valor === "string" && valor.trim().length <= 50)
        .withMessage("La carrera no puede superar 50 caracteres.")
];

const obtenerErroresValidacion = (req) => validationResult(req)
    .array()
    .map((error) => error.msg);

const validarUsuarioApi = [
    ...reglasUsuario(param),
    (req, _res, next) => {
        if (obtenerErroresValidacion(req).length > 0) {
            return next(crearError("Datos de usuario inválidos.", 400));
        }

        next();
    }
];

const validarConsultaUsuario = reglasUsuario(query);

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
    soloJson,
    validarUsuarioApi,
    validarConsultaUsuario,
    obtenerErroresValidacion
};
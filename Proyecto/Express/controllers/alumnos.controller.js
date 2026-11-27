const Joi = require("joi");
const { crearError } = require("../middleware/validaciones");
const Alumno = require("../models/alumno.model");

const esquemaAlumno = Joi.object({
    nombre: Joi.string().trim().min(4).required().messages({
        "string.empty": "El nombre es obligatorio",
        "string.min": "El nombre debe tener al menos 4 caracteres",
        "any.required": "El nombre es obligatorio",
    }),
    numeroControl: Joi.string().trim().min(6).max(10).required().messages({
        "string.empty": "El número de control es obligatorio",
        "string.min": "El número de control debe tener entre 6 y 10 caracteres",
        "string.max": "El número de control debe tener entre 6 y 10 caracteres",
        "any.required": "El número de control es obligatorio",
    }),
    edad: Joi.number().integer().min(17).max(60).required().messages({
        "number.base": "La edad debe ser un número",
        "number.integer": "La edad debe ser un número entero",
        "number.min": "La edad debe estar entre 17 y 60 años",
        "number.max": "La edad debe estar entre 17 y 60 años",
        "any.required": "La edad es obligatoria",
    }),
    carrera: Joi.string().trim().required().messages({
        "string.empty": "La carrera es obligatoria",
        "any.required": "La carrera es obligatoria",
    }),
});

const esquemaId = Joi.number().integer().min(1).max(2147483647).required();

const responder400 = (res, errores) =>
    res.status(400).json({ mensaje: "Los datos del alumno no son válidos", errores });

// Devuelve el id numérico o responde 400 (y devuelve null)
const leerId = (req, res) => {
    const { error, value } = esquemaId.validate(req.params.id);
    if (error) {
        responder400(res, ["El ID debe ser un número entero positivo"]);
        return null;
    }
    return value;
};

const leerCuerpo = (req, res) => {
    const { error, value } = esquemaAlumno.validate(req.body, { abortEarly: false });
    if (error) {
        responder400(res, error.details.map((detalle) => detalle.message));
        return null;
    }
    return value;
};

// 23505 = violación de UNIQUE en PostgreSQL (matrícula duplicada)
const traducirError = (error) => {
    if (error.code === "23505") {
        const conflicto = crearError("Ya existe un alumno con ese número de control", 409);
        conflicto.publicMessage = "Ya existe un alumno con ese número de control.";
        return conflicto;
    }
    return error;
};

const noEncontrado = (res) => res.status(404).json({ mensaje: "No se encontró el alumno" });

const listar = async (req, res) => {
    res.json(await Alumno.obtenerTodos());
};

const consultar = async (req, res) => {
    const id = leerId(req, res);
    if (id === null) return;

    const alumno = await Alumno.obtenerPorId(id);
    if (!alumno) return noEncontrado(res);

    res.json(alumno);
};

const registrar = async (req, res) => {
    const datos = leerCuerpo(req, res);
    if (!datos) return;

    try {
        const alumno = await Alumno.crear(datos);
        res.status(201).json({ mensaje: "Alumno registrado", alumno });
    } catch (error) {
        throw traducirError(error);
    }
};

const actualizar = async (req, res) => {
    const id = leerId(req, res);
    if (id === null) return;
    const datos = leerCuerpo(req, res);
    if (!datos) return;

    try {
        const alumno = await Alumno.actualizar(id, datos);
        if (!alumno) return noEncontrado(res);
        res.json({ mensaje: "Alumno actualizado", alumno });
    } catch (error) {
        throw traducirError(error);
    }
};

const eliminar = async (req, res) => {
    const id = leerId(req, res);
    if (id === null) return;

    const alumno = await Alumno.eliminar(id);
    if (!alumno) return noEncontrado(res);

    res.json({ mensaje: "Alumno eliminado", alumno });
};

module.exports = { listar, consultar, registrar, actualizar, eliminar };

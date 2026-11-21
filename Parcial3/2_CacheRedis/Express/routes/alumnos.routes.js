const express = require("express");
const Joi = require("joi");
const autenticacionApiKey = require("../middleware/autenticacion");
const { crearCacheMiddleware } = require("../middleware/cache");
const { redisClient } = require("../config/redis");

const router = express.Router();
const alumnos = [];
const claveCacheAlumnos = "alumnos:listado";
const ttlCacheSegundos = 60;

const esquemaAlumno = Joi.object({
    nombre: Joi.string().trim().min(4).required(),
    numeroControl: Joi.string().trim().min(6).max(10).required(),
    edad: Joi.number().integer().min(17).max(60).required(),
    carrera: Joi.string().trim().required(),
});

router.use(autenticacionApiKey);

/**
 * @swagger
 * /api/alumnos:
 *   get:
 *     tags: [Alumnos]
 *     summary: Listar alumnos con caché Redis
 *     description: La respuesta se almacena en Redis durante 60 segundos. El encabezado X-Cache indica HIT o MISS.
 *     responses:
 *       200:
 *         description: Lista de alumnos.
 *       401:
 *         description: API Key ausente o inválida.
 *       503:
 *         description: Redis no está disponible.
 */
router.get("/", crearCacheMiddleware({
    redis: redisClient,
    clave: claveCacheAlumnos,
    ttlSegundos: ttlCacheSegundos,
    cargarDatos: async () => alumnos
}));

/**
 * @swagger
 * /api/alumnos:
 *   post:
 *     tags: [Alumnos]
 *     summary: Registrar alumno
 *     description: Registra un alumno e invalida la lista almacenada en Redis.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NuevoAlumno"
 *     responses:
 *       201:
 *         description: Alumno registrado.
 *       400:
 *         description: Los datos enviados no son válidos.
 *       401:
 *         description: API Key ausente o inválida.
 */
router.post("/", async (req, res) => {
    const { error, value } = esquemaAlumno.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            mensaje: "Los datos del alumno no son válidos",
            errores: error.details.map((detalle) => detalle.message),
        });
    }

    alumnos.push(value);
    try {
        await redisClient.del(claveCacheAlumnos);
    } catch (error) {
        error.status = 503;
        throw error;
    }

    res.status(201).json({ mensaje: "Alumno registrado", alumno: value });
});

module.exports = router;

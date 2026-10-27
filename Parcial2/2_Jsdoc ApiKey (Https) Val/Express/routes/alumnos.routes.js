const express = require("express");
const Joi = require("joi");
const autenticacionApiKey = require("../middleware/autenticacion");

const router = express.Router();
const alumnos = [];

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

router.use(autenticacionApiKey);

/**
 * @swagger
 * /api/alumnos:
 *   get:
 *     tags: [Alumnos]
 *     summary: Listar alumnos
 *     description: |
 *       Devuelve los alumnos registrados.
 *
 *       **cURL**
 *       ```bash
 *       curl -k https://localhost:3000/api/alumnos -H "x-api-key: TU_API_KEY"
 *       ```
 *
 *       **JavaScript**
 *       ```js
 *       const response = await fetch("https://localhost:3000/api/alumnos", {
 *         headers: { "x-api-key": API_KEY }
 *       });
 *       console.log(await response.json());
 *       ```
 *     responses:
 *       200:
 *         description: Lista de alumnos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Alumno"
 *       401:
 *         description: API Key ausente o inválida.
 */
router.get("/", (req, res) => {
    res.json(alumnos);
});

router.get("/:numeroControl", (req, res) => {
    const alumno = alumnos.find((registro) => registro.numeroControl === req.params.numeroControl);

    if (!alumno) {
        return res.status(404).json({ mensaje: "No se encontró el alumno" });
    }

    res.json(alumno);
});

/**
 * @swagger
 * /api/alumnos:
 *   post:
 *     tags: [Alumnos]
 *     summary: Registrar alumno
 *     description: |
 *       Registra un alumno después de validar sus datos.
 *
 *       **cURL**
 *       ```bash
 *       curl -k -X POST https://localhost:3000/api/alumnos -H "x-api-key: TU_API_KEY" -H "Content-Type: application/json" -d "{\"nombre\":\"Ana Pérez\",\"numeroControl\":\"23100211\",\"edad\":21,\"carrera\":\"API REST\"}"
 *       ```
 *
 *       **JavaScript**
 *       ```js
 *       const response = await fetch("https://localhost:3000/api/alumnos", {
 *         method: "POST",
 *         headers: {
 *           "x-api-key": API_KEY,
 *           "Content-Type": "application/json"
 *         },
 *         body: JSON.stringify({
 *           nombre: "Ana Pérez",
 *           numeroControl: "23100211",
 *           edad: 21,
 *           carrera: "API REST"
 *         })
 *       });
 *       console.log(await response.json());
 *       ```
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NuevoAlumno"
 *     responses:
 *       201:
 *         description: Alumno registrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Alumno registrado
 *                 alumno:
 *                   $ref: "#/components/schemas/Alumno"
 *       400:
 *         description: Los datos enviados no son válidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Los datos del alumno no son válidos
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: El nombre es obligatorio
 *       401:
 *         description: API Key ausente o inválida.
 */
router.post("/", (req, res) => {
    const { error, value } = esquemaAlumno.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            mensaje: "Los datos del alumno no son válidos",
            errores: error.details.map((detalle) => detalle.message),
        });
    }

    alumnos.push(value);
    res.status(201).json({ mensaje: "Alumno registrado", alumno: value });
});

module.exports = router;
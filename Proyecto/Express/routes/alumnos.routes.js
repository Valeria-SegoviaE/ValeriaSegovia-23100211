const express = require("express");
const autenticacionApiKey = require("../middleware/autenticacion");
const controlador = require("../controllers/alumnos.controller");

const router = express.Router();

router.use(autenticacionApiKey);

/**
 * @swagger
 * /api/alumnos:
 *   get:
 *     tags: [Alumnos]
 *     summary: Listar alumnos
 *     description: Devuelve todos los alumnos guardados en la base de datos PostgreSQL (Supabase), ordenados por ID.
 *     responses:
 *       200:
 *         description: Lista de alumnos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Alumno"
 *             example:
 *               - id: 1
 *                 nombre: Valeria Segovia
 *                 numeroControl: "23100211"
 *                 edad: 21
 *                 carrera: Ingeniería en Sistemas Computacionales
 *       401:
 *         description: API Key ausente o inválida.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get("/", controlador.listar);

/**
 * @swagger
 * /api/alumnos/{id}:
 *   get:
 *     tags: [Alumnos]
 *     summary: Consultar un alumno por ID
 *     description: Busca un alumno por su ID (llave primaria de la tabla).
 *     parameters:
 *       - $ref: "#/components/parameters/AlumnoId"
 *     responses:
 *       200:
 *         description: Alumno encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Alumno"
 *             example:
 *               id: 1
 *               nombre: Valeria Segovia
 *               numeroControl: "23100211"
 *               edad: 21
 *               carrera: Ingeniería en Sistemas Computacionales
 *       400:
 *         description: El ID no es un entero positivo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorValidacion"
 *       401:
 *         description: API Key ausente o inválida.
 *       404:
 *         description: No existe un alumno con ese ID.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: No se encontró el alumno
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get("/:id", controlador.consultar);

/**
 * @swagger
 * /api/alumnos:
 *   post:
 *     tags: [Alumnos]
 *     summary: Registrar un alumno
 *     description: |
 *       Registra un alumno nuevo. Todos los campos son obligatorios.
 *       El número de control (matrícula) debe ser único.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NuevoAlumno"
 *           example:
 *             nombre: Ana Pérez
 *             numeroControl: "23100999"
 *             edad: 20
 *             carrera: Ingeniería en Sistemas Computacionales
 *     responses:
 *       201:
 *         description: Alumno registrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RespuestaAlumno"
 *             example:
 *               mensaje: Alumno registrado
 *               alumno:
 *                 id: 2
 *                 nombre: Ana Pérez
 *                 numeroControl: "23100999"
 *                 edad: 20
 *                 carrera: Ingeniería en Sistemas Computacionales
 *       400:
 *         description: Datos inválidos o campos obligatorios faltantes.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorValidacion"
 *       401:
 *         description: API Key ausente o inválida.
 *       409:
 *         description: Ya existe un alumno con ese número de control.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             example:
 *               error:
 *                 status: 409
 *                 code: ERROR_CONFLICTO
 *                 message: Ya existe un alumno con ese número de control.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post("/", controlador.registrar);

/**
 * @swagger
 * /api/alumnos/{id}:
 *   put:
 *     tags: [Alumnos]
 *     summary: Actualizar un alumno
 *     description: |
 *       Reemplaza los datos del alumno identificado por su ID. Se validan todos los campos
 *       antes de actualizar. Si cambias el número de control, no puede coincidir con el de otro alumno.
 *     parameters:
 *       - $ref: "#/components/parameters/AlumnoId"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NuevoAlumno"
 *           example:
 *             nombre: Ana Pérez López
 *             numeroControl: "23100999"
 *             edad: 21
 *             carrera: Ingeniería Industrial
 *     responses:
 *       200:
 *         description: Alumno actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RespuestaAlumno"
 *             example:
 *               mensaje: Alumno actualizado
 *               alumno:
 *                 id: 2
 *                 nombre: Ana Pérez López
 *                 numeroControl: "23100999"
 *                 edad: 21
 *                 carrera: Ingeniería Industrial
 *       400:
 *         description: ID o datos inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorValidacion"
 *       401:
 *         description: API Key ausente o inválida.
 *       404:
 *         description: No existe un alumno con ese ID.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: No se encontró el alumno
 *       409:
 *         description: El número de control ya pertenece a otro alumno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.put("/:id", controlador.actualizar);

/**
 * @swagger
 * /api/alumnos/{id}:
 *   delete:
 *     tags: [Alumnos]
 *     summary: Eliminar un alumno
 *     description: Elimina el alumno con el ID indicado. Si no existe responde 404.
 *     parameters:
 *       - $ref: "#/components/parameters/AlumnoId"
 *     responses:
 *       200:
 *         description: Alumno eliminado (se devuelve el registro borrado).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RespuestaAlumno"
 *             example:
 *               mensaje: Alumno eliminado
 *               alumno:
 *                 id: 2
 *                 nombre: Ana Pérez López
 *                 numeroControl: "23100999"
 *                 edad: 21
 *                 carrera: Ingeniería Industrial
 *       400:
 *         description: El ID no es un entero positivo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorValidacion"
 *       401:
 *         description: API Key ausente o inválida.
 *       404:
 *         description: No existe un alumno con ese ID.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: No se encontró el alumno
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.delete("/:id", controlador.eliminar);

module.exports = router;

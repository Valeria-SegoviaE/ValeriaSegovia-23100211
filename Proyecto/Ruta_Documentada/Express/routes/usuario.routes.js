const express = require("express");
const halson = require("halson");

const router = express.Router();

router.get("/", (req, res) => {
    const respuesta = halson({
        mensaje: "Colección de usuarios"
    })
        .addLink("self", req.originalUrl)
        .addLink("inicio", "/");

    res.type("application/hal+json").json(respuesta);
});

/**
 * @swagger
 * /api/usuario/{nombre}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Consultar usuario por nombre
 *     description: |
 *       Devuelve un saludo HAL con edad y carrera. Disponible únicamente entre las 07:00 y las 14:59, según la hora local del servidor.
 *
 *       **cURL**
 *       ```bash
 *       curl -k "https://localhost:3000/api/usuario/Valeria?edad=21&carrera=API%20REST" -H "x-api-key: TU_API_KEY"
 *       ```
 *
 *       **JavaScript**
 *       ```js
 *       const url = new URL("https://localhost:3000/api/usuario/Valeria");
 *       url.searchParams.set("edad", "21");
 *       url.searchParams.set("carrera", "API REST");
 *       const response = await fetch(url, {
 *         headers: { "x-api-key": API_KEY }
 *       });
 *       console.log(await response.json());
 *       ```
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         description: Nombre del usuario.
 *         schema:
 *           type: string
 *       - in: query
 *         name: edad
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: carrera
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Saludo en formato HAL.
 *         content:
 *           application/hal+json:
 *             schema:
 *               $ref: "#/components/schemas/RespuestaUsuario"
 *       401:
 *         description: API Key ausente o inválida.
 *       403:
 *         description: La solicitud está fuera del horario permitido.
 */
router.get("/:nombre", (req, res) => {

    const nombre = req.params.nombre;
    const edad = req.query.edad;
    const carrera = req.query.carrera;

    const respuesta = halson({
        mensaje: `Hola ${nombre}`,
        edad: edad,
        carrera: carrera
    })
        .addLink("self", req.originalUrl)
        .addLink("usuarios", req.baseUrl)
        .addLink("inicio", "/");

    res.type("application/hal+json").json(respuesta);
});

module.exports = router;
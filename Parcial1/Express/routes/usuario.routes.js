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
const express = require("express");

const router = express.Router();


router.get("/:nombre", (req, res) => {

    const nombre = req.params.nombre;
    const edad = req.query.edad;
    const carrera = req.query.carrera;

    res.json({
        mensaje: `Hola ${nombre}`,
        edad: edad,
        carrera: carrera
    });

});

module.exports = router;
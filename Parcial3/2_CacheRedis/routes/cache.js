const express = require("express");
const { clienteRedis } = require("../redis");

const router = express.Router();
const tiempoExpiracionSegundos = 60;

router.post("/cache", async (req, res) => {
    try {
        const cuerpo = req.body ?? {};
        const { clave, valor } = cuerpo;
        const tieneValor = Object.prototype.hasOwnProperty.call(cuerpo, "valor");

        if (typeof clave !== "string" || clave.trim() === "" || !tieneValor) {
            return res.status(400).json({
                mensaje: "Debes proporcionar una clave y un valor",
            });
        }

        await clienteRedis.set(clave, JSON.stringify(valor), {
            EX: tiempoExpiracionSegundos,
        });

        return res.json({
            mensaje: "Informacion guardada correctamente",
            clave,
        });
    } catch (error) {
        console.error("Error al guardar informacion:", error.message);
        return res.status(500).json({ mensaje: "Error al guardar informacion" });
    }
});

router.get("/cache/:clave", async (req, res) => {
    try {
        const { clave } = req.params;
        const valorJson = await clienteRedis.get(clave);

        if (valorJson === null) {
            return res.status(404).json({
                mensaje: "No se encontro informacion en Redis",
            });
        }

        console.log("DATOS OBTENIDOS DESDE REDIS:", valorJson);

        return res.json({
            origen: "Redis",
            clave,
            valor: JSON.parse(valorJson),
        });
    } catch (error) {
        console.error("Error al obtener informacion:", error.message);
        return res.status(500).json({ mensaje: "Error al obtener informacion" });
    }
});

router.delete("/cache/:clave", async (req, res) => {
    try {
        const eliminado = (await clienteRedis.del(req.params.clave)) === 1;

        return res.json({
            mensaje: eliminado
                ? "Informacion eliminada correctamente"
                : "La clave no existe",
            eliminado,
        });
    } catch (error) {
        console.error("Error al eliminar informacion:", error.message);
        return res.status(500).json({ mensaje: "Error al eliminar informacion" });
    }
});

module.exports = router;

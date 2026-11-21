const { obtenerConCache } = require("../services/cache");

const crearCacheMiddleware = ({ redis, clave, ttlSegundos, cargarDatos }) =>
    async (req, res, next) => {
        try {
            const resultado = await obtenerConCache(redis, clave, ttlSegundos, cargarDatos);

            res.setHeader("X-Cache", resultado.cacheHit ? "HIT" : "MISS");
            return res.json(resultado.datos);
        } catch (error) {
            return next(error);
        }
    };

module.exports = { crearCacheMiddleware };

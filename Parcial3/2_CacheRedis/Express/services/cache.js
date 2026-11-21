const obtenerConCache = async (redis, clave, ttlSegundos, cargarDatos) => {
    let datoEnCache;
    try {
        datoEnCache = await redis.get(clave);
    } catch (error) {
        error.status = 503;
        throw error;
    }

    if (datoEnCache !== null) {
        return { datos: JSON.parse(datoEnCache), cacheHit: true };
    }

    const datos = await cargarDatos();
    try {
        await redis.set(clave, JSON.stringify(datos), { EX: ttlSegundos });
    } catch (error) {
        error.status = 503;
        throw error;
    }

    return { datos, cacheHit: false };
};

module.exports = { obtenerConCache };

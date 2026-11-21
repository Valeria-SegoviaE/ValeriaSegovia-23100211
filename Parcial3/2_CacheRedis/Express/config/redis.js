const { createClient } = require("redis");
const logger = require("./logger");

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (error) => {
    logger.error("Error en la conexión con Redis", { mensaje: error.message });
});

module.exports = { redisClient };

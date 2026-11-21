const { createClient } = require("redis");

const clienteRedis = createClient({
    url: "redis://127.0.0.1:6379",
});

clienteRedis.on("error", (error) => {
    console.error("Error en la conexión con Redis:", error.message);
});

async function conectarRedis() {
    if (!clienteRedis.isOpen) {
        await clienteRedis.connect();
    }

    await clienteRedis.ping();
    console.log("Redis conectado correctamente");
}

module.exports = { clienteRedis, conectarRedis };

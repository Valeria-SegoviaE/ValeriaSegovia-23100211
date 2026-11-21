require("dotenv").config();

const https = require("https");
const fs = require("fs");
const path = require("path");
const app = require("./src/app");
const { redisClient } = require("./config/redis");

const PORT = Number(process.env.PORT) || 3000;

const iniciarServidor = async () => {
    await redisClient.connect();

    const opciones = {
        key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
    };

    const servidor = https.createServer(opciones, app);
    servidor.listen(PORT, () => {
        console.log(`Servidor escuchando en https://localhost:${PORT}`);
    });
};

if (require.main === module) {
    iniciarServidor().catch(async (error) => {
        console.error("No fue posible iniciar el servidor con Redis:", error.message);
        if (redisClient.isOpen) {
            await redisClient.destroy();
        }
        process.exitCode = 1;
    });
}

module.exports = app;

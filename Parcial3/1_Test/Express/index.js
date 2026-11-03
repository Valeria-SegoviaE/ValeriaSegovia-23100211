require("dotenv").config();

const https = require("https");
const fs = require("fs");
const path = require("path");
const app = require("./src/app");

const PORT = Number(process.env.PORT) || 3000;

if (require.main === module) {
    const opciones = {
        key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
    };

    https.createServer(opciones, app).listen(PORT, () => {
        console.log(`Servidor escuchando en https://localhost:${PORT}`);
    });
}

module.exports = app;

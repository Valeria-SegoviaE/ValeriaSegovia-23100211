require("dotenv").config();

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const db = require("./config/db");

// ----- Variables de entorno (se leen del archivo .env) -----
const PORT       = process.env.PORT       || 3000;
const DBHOST     = process.env.DBHOST     || "localhost";
const DBPORT     = process.env.DBPORT     || 5432;
const DBDATABASE = process.env.DBDATABASE || "postgres";
const DBUSER     = process.env.DBUSER     || "postgres";
const DBPASSWORD = process.env.DBPASSWORD || "";

// ----- Conexión a PostgreSQL (Supabase) -----
db.iniciar({
    host:     DBHOST,
    port:     Number(DBPORT),
    database: DBDATABASE,
    user:     DBUSER,
    password: DBPASSWORD,
});

const app = require("./src/app");

if (require.main === module) {
    const rutaKey = path.join(__dirname, "certs", "key.pem");
    const rutaCert = path.join(__dirname, "certs", "cert.pem");
    const hayCertificados = fs.existsSync(rutaKey) && fs.existsSync(rutaCert);

    if (hayCertificados && process.env.NODE_ENV !== "production") {
      
        https
            .createServer({ key: fs.readFileSync(rutaKey), cert: fs.readFileSync(rutaCert) }, app)
            .listen(PORT, () => console.log(`Servidor escuchando en https://localhost:${PORT}`));
    } else {
        
        http
            .createServer(app)
            .listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
    }
}

module.exports = app;

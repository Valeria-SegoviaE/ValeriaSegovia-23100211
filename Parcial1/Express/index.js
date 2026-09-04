const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const usuarioRoutes = require("./routes/usuario.routes");
const archivoRoutes = require("./routes/archivo.routes");
const {
    rutaNoEncontrada,
    horarioPermitido,
    soloJson,
    errorHandler
} = require("./middleware/validaciones");

const app = express();

const PORT = 3000;
const carpetaLogs = path.join(__dirname, "logs");
const archivoLogs = path.join(carpetaLogs, "access.log");

fs.mkdirSync(carpetaLogs, { recursive: true });
const streamLogs = fs.createWriteStream(archivoLogs, { flags: "a" });

morgan.token("fecha-local", () => {
    const fecha = new Date();
    const completar = (valor) => String(valor).padStart(2, "0");
    const diferencia = -fecha.getTimezoneOffset();
    const signo = diferencia >= 0 ? "+" : "-";
    const minutos = Math.abs(diferencia);
    const zona = `${signo}${completar(Math.floor(minutos / 60))}${completar(minutos % 60)}`;

    return `${completar(fecha.getDate())}/${completar(fecha.getMonth() + 1)}/${fecha.getFullYear()}:${completar(fecha.getHours())}:${completar(fecha.getMinutes())}:${completar(fecha.getSeconds())} ${zona}`;
});

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
    req.fechaSolicitud = new Date().toISOString();
    res.setHeader("X-Fecha-Solicitud", req.fechaSolicitud);
    next();
});

app.use(
    morgan(':remote-addr - :remote-user [:fecha-local] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {
        stream: streamLogs
    })
);

app.get("/", (req, res) => {
    res.json({
        mensaje: "Servidor Express funcionando correctamente, hecho por Valeria Segovia Espinoza"
    });
});

app.use("/api/usuario", horarioPermitido(7, 9), soloJson, usuarioRoutes);
app.use("/api/archivo", archivoRoutes);

app.use(rutaNoEncontrada);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
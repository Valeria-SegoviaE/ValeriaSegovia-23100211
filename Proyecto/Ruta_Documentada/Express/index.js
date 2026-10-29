require("dotenv").config();

const express = require("express");
const https = require("https");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const openApiSpec = require("./config/swagger");
const autenticacionApiKey = require("./middleware/autenticacion");
const manejadorErrores = require("./middleware/errores");
const usuarioRoutes = require("./routes/usuario.routes");
const archivoRoutes = require("./routes/archivo.routes");
const alumnosRoutes = require("./routes/alumnos.routes");
const {
    rutaNoEncontrada,
    horarioPermitido,
    soloJson,
} = require("./middleware/validaciones");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

const PORT = Number(process.env.PORT) || 3000;
const opciones = {
    key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
};
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

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", autenticacionApiKey, express.static(path.join(__dirname, "uploads")));
app.get("/api-docs.json", (req, res) => res.json(openApiSpec));
app.get("/docs", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "docs.html"));
});
app.get("/json", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "json.html"));
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    customSiteTitle: "API REST de Valeria Segovia",
    customJs: "/docs-navigation.js",
    customCssUrl: "/docs-navigation.css",
    customCss: `
        body {
            background: #f5f7fb;
            font-family: Arial, Helvetica, sans-serif;
        }

        .swagger-ui .topbar {
            background: #102a43;
        }

        .swagger-ui .wrapper {
            max-width: 1120px;
        }

        .swagger-ui .info {
            margin: 28px 0;
        }

        .swagger-ui .info .title,
        .swagger-ui .opblock-tag {
            color: #102a43;
        }

        .swagger-ui .info .description {
            color: #34495e;
            font-size: 15px;
            line-height: 1.65;
        }

        .swagger-ui .info .description img[src$="/api-portada.svg"] {
            display: none;
        }

        .swagger-ui .opblock {
            margin: 0 0 12px;
            border-radius: 6px;
            box-shadow: none;
        }

        .swagger-ui .btn {
            border-radius: 5px;
            box-shadow: none;
        }

        .swagger-ui .btn.authorize {
            border-color: #b7c8e8;
            background: #eef2ff;
            color: #344a83;
        }

        .swagger-ui select {
            border-radius: 5px;
        }
    `
}));

app.post("/api/validar-key", autenticacionApiKey, (req, res) => {
    res.json({ mensaje: "API Key válida" });
});

app.get("/inicio", (req, res) => {
    res.render("inicio", {
        titulo: "API REST de Valeria Segovia",
        mensaje: "Servidor Express funcionando correctamente",
        rutas: [
            { metodo: "GET", url: "/api/usuario/Valeria?edad=21&carrera=API%20REST" }
        ]
    });
});

app.use("/api/alumnos", alumnosRoutes);
app.use("/api/usuario", autenticacionApiKey, horarioPermitido(7, 15), soloJson, usuarioRoutes);
app.use("/api/archivo", autenticacionApiKey, archivoRoutes);

app.use(rutaNoEncontrada);

app.use(manejadorErrores);

https.createServer(opciones, app).listen(PORT, () => {
    console.log(`Servidor escuchando en https://localhost:${PORT}`);
}); 
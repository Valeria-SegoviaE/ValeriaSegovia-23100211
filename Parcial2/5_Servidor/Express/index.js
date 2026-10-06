require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const autenticacionBasica = require("./middleware/autenticacion");
const manejadorErrores = require("./middleware/errores");
const usuarioRoutes = require("./routes/usuario.routes");
const archivoRoutes = require("./routes/archivo.routes");
const {
    rutaNoEncontrada,
    horarioPermitido,
    soloJson,
    validarConsultaUsuario,
    obtenerErroresValidacion
} = require("./middleware/validaciones");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

const PORT = Number(process.env.PORT) || 3000;
const datosInicio = {
    titulo: "API REST de Valeria Segovia",
    mensaje: "Servidor Express funcionando correctamente",
    rutas: [
        { metodo: "GET", url: "/api/usuario/Valeria?edad=21&carrera=API%20REST" }
    ]
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

app.use("/uploads", autenticacionBasica, express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.render("inicio", {
        ...datosInicio,
        consulta: { nombre: "", edad: "", carrera: "" },
        errores: [],
        resultado: null
    });
});

app.get("/consulta/usuario", ...validarConsultaUsuario, (req, res) => {
    const consulta = {
        nombre: typeof req.query.nombre === "string" ? req.query.nombre : "",
        edad: typeof req.query.edad === "string" ? req.query.edad : "",
        carrera: typeof req.query.carrera === "string" ? req.query.carrera : ""
    };
    const errores = obtenerErroresValidacion(req);

    if (errores.length > 0) {
        return res.status(400).render("inicio", {
            ...datosInicio,
            consulta,
            errores,
            resultado: null
        });
    }

    res.render("inicio", {
        ...datosInicio,
        consulta,
        errores: [],
        resultado: {
            mensaje: `Hola ${consulta.nombre}`,
            edad: consulta.edad,
            carrera: consulta.carrera
        }
    });
});

app.use("/api", (req, res, next) => {
    const consultaUsuario = req.method === "GET" && /^\/usuario\/[^/]+$/.test(req.path);

    if (consultaUsuario) return next();
    autenticacionBasica(req, res, next);
});
app.use("/api/usuario", horarioPermitido(7, 15), soloJson, usuarioRoutes);
app.use("/api/archivo", archivoRoutes);

app.use(rutaNoEncontrada);

app.use(manejadorErrores);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
}); 
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const openApiSpec = require("../config/swagger");
const alumnosRoutes = require("../routes/alumnos.routes");
const manejadorErrores = require("../middleware/errores");
const { rutaNoEncontrada } = require("../middleware/validaciones");

const app = express();

app.use(express.json());
app.use(cors());
app.get("/api-docs.json", (req, res) => res.json(openApiSpec));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use("/api/alumnos", alumnosRoutes);
app.use(rutaNoEncontrada);
app.use(manejadorErrores);

module.exports = app;

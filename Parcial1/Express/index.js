const express = require("express");
const usuarioRoutes = require("./routes/usuario.routes");

const app = express();

const PORT = 3000;

app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        mensaje: "Servidor Express funcionando correctamente, hecho por Valeria Segovia Espinoza"
    });
});

app.use("/api/usuario", usuarioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
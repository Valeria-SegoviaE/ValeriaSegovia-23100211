require("../index"); // carga .env y configura la conexión a la base
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

(async () => {
    const sql = fs.readFileSync(path.join(__dirname, "..", "db", "schema.sql"), "utf8");
    await pool.query(sql);
    const { rows } = await pool.query("select count(*)::int as total from alumnos");
    console.log(`Base de datos lista. Alumnos registrados: ${rows[0].total}`);
    await pool.end();
})().catch((error) => {
    console.error("No se pudo inicializar la base de datos:", error.message);
    process.exit(1);
});

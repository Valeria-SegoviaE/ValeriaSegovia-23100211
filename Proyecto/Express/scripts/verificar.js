require("../index"); // carga .env y configura la conexión a la base
const pool = require("../config/db");

const ok = (m) => console.log(`  ✔ ${m}`);

(async () => {
    console.log("\nVerificación de la base de datos de la API Final\n");

    const { rows: info } = await pool.query("select now() as hora");
    ok(`Conectado a la base de datos (${new Date(info[0].hora).toISOString()})`);

    try {
        await pool.query("select 1 from alumnos limit 1");
    } catch (e) {
        throw new Error("La tabla alumnos no existe. Ejecuta primero: npm run db:init");
    }
    ok("Tabla alumnos encontrada");

    const prueba = "TMP" + Date.now().toString().slice(-7);
    await pool.query(
        "insert into alumnos (nombre, numero_control, edad, carrera) values ($1,$2,$3,$4)",
        ["Alumno Prueba", prueba, 20, "Prueba"]
    );
    ok("INSERT correcto");
    const { rows } = await pool.query("select nombre from alumnos where numero_control = $1", [prueba]);
    ok(`SELECT correcto (${rows[0].nombre})`);
    await pool.query("delete from alumnos where numero_control = $1", [prueba]);
    ok("DELETE correcto");

    const { rows: total } = await pool.query("select count(*)::int as total from alumnos");
    console.log(`\nBase de datos DISPONIBLE. Alumnos registrados: ${total[0].total}\n`);
    await pool.end();
})().catch((e) => {
    console.error(`\n  ✘ ${e.message}\n`);
    process.exit(1);
});

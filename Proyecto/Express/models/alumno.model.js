const db = require("../config/db");

// Columnas que se devuelven al cliente (numero_control -> numeroControl)
const COLUMNAS = 'id, nombre, numero_control as "numeroControl", edad, carrera';

const obtenerTodos = async () => {
    const { rows } = await db.query(`select ${COLUMNAS} from alumnos order by id`);
    return rows;
};

const obtenerPorId = async (id) => {
    const { rows } = await db.query(`select ${COLUMNAS} from alumnos where id = $1`, [id]);
    return rows[0] || null;
};

const crear = async ({ nombre, numeroControl, edad, carrera }) => {
    const { rows } = await db.query(
        `insert into alumnos (nombre, numero_control, edad, carrera)
         values ($1, $2, $3, $4)
         returning ${COLUMNAS}`,
        [nombre, numeroControl, edad, carrera]
    );
    return rows[0];
};

const actualizar = async (id, { nombre, numeroControl, edad, carrera }) => {
    const { rows } = await db.query(
        `update alumnos
            set nombre = $1, numero_control = $2, edad = $3, carrera = $4
          where id = $5
          returning ${COLUMNAS}`,
        [nombre, numeroControl, edad, carrera, id]
    );
    return rows[0] || null;
};

const eliminar = async (id) => {
    const { rows } = await db.query(`delete from alumnos where id = $1 returning ${COLUMNAS}`, [id]);
    return rows[0] || null;
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };

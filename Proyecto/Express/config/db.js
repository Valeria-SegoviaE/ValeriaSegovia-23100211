const { Pool } = require("pg");

let pool = null;

if (process.env.NODE_ENV === "test") {
    const { newDb } = require("pg-mem");
    const memoria = newDb();
    memoria.public.none(`
        create table alumnos (
            id serial primary key,
            nombre text not null,
            numero_control varchar(10) not null unique,
            edad smallint not null,
            carrera text not null,
            created_at timestamptz not null default now()
        );
    `);
    const { Pool: PoolMemoria } = memoria.adapters.createPg();
    pool = new PoolMemoria();
}

const iniciar = (configuracion) => {
    if (pool) return; // ya iniciado (o modo pruebas)

    pool = new Pool({
        ...configuracion,
        ssl: configuracion.host === "localhost" ? false : { rejectUnauthorized: false },
        max: process.env.VERCEL ? 1 : 10, // serverless: una conexión por instancia
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    });
};

const query = async (...argumentos) => {
    if (!pool) throw new Error("La base de datos no está configurada (revisa index.js y el archivo .env)");
    return pool.query(...argumentos);
};

const end = async () => {
    if (pool) await pool.end();
};

module.exports = { iniciar, query, end };

const test = require("node:test");
const assert = require("node:assert/strict");
const { obtenerConCache } = require("../services/cache");

test("guarda los datos con TTL cuando la clave no existe", async () => {
    const guardados = new Map();
    const redis = {
        async get(clave) {
            return guardados.get(clave) || null;
        },
        async set(clave, valor, opciones) {
            guardados.set(clave, valor);
            assert.deepEqual(opciones, { EX: 30 });
        },
    };
    const cargarDatos = async () => [{ nombre: "Ana" }];

    const resultado = await obtenerConCache(redis, "alumnos", 30, cargarDatos);

    assert.deepEqual(resultado, { datos: [{ nombre: "Ana" }], cacheHit: false });
    assert.equal(guardados.get("alumnos"), '[{"nombre":"Ana"}]');
});

test("devuelve el valor de Redis sin volver a cargar los datos", async () => {
    let cargaEjecutada = false;
    const redis = {
        async get() {
            return '[{"nombre":"Ana"}]';
        },
    };

    const resultado = await obtenerConCache(redis, "alumnos", 30, async () => {
        cargaEjecutada = true;
        return [];
    });

    assert.deepEqual(resultado, { datos: [{ nombre: "Ana" }], cacheHit: true });
    assert.equal(cargaEjecutada, false);
});

test("propaga errores de Redis en vez de responder como si hubiera caché", async () => {
    const falloRedis = new Error("Redis no disponible");
    const redis = {
        async get() {
            throw falloRedis;
        },
    };

    await assert.rejects(
        obtenerConCache(redis, "alumnos", 30, async () => []),
        falloRedis
    );
});

test("la ruta informa hits y elimina el caché al registrar un alumno", async (t) => {
    process.env.API_KEY = "test-api-key";
    const { redisClient } = require("../config/redis");
    const app = require("../src/app");
    const almacen = new Map();

    redisClient.get = async (clave) => almacen.get(clave) || null;
    redisClient.set = async (clave, valor) => almacen.set(clave, valor);
    redisClient.del = async (clave) => almacen.delete(clave);

    const servidor = app.listen(0);
    await new Promise((resolve) => servidor.once("listening", resolve));
    t.after(() => new Promise((resolve) => servidor.close(resolve)));

    const url = `http://127.0.0.1:${servidor.address().port}/api/alumnos`;
    const headers = { "x-api-key": "test-api-key" };

    const primeraConsulta = await fetch(url, { headers });
    assert.equal(primeraConsulta.headers.get("x-cache"), "MISS");
    assert.deepEqual(await primeraConsulta.json(), []);

    const consultaEnCache = await fetch(url, { headers });
    assert.equal(consultaEnCache.headers.get("x-cache"), "HIT");

    const registro = await fetch(url, {
        method: "POST",
        headers: { ...headers, "content-type": "application/json" },
        body: JSON.stringify({
            nombre: "Ana Pérez",
            numeroControl: "23100211",
            edad: 21,
            carrera: "API REST",
        }),
    });
    assert.equal(registro.status, 201);

    const consultaActualizada = await fetch(url, { headers });
    assert.equal(consultaActualizada.headers.get("x-cache"), "MISS");
    assert.equal((await consultaActualizada.json()).length, 1);
});

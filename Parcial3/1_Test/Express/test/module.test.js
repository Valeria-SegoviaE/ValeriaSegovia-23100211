process.env.NODE_ENV = "test";
if (!process.env.API_KEY) {
    process.env.API_KEY = "test-api-key";
}

const assert = require("node:assert/strict");
const test = require("node:test");
const request = require("supertest");
const app = require("../src/app");

test("API de alumnos", async (suite) => {
    const alumno = {
        nombre: "Valeria Segovia",
        numeroControl: "23100211",
        edad: 21,
        carrera: "Ing. Sistemas Computacionales",
    };

    await suite.test("rechaza solicitudes sin API Key", async () => {
        const respuesta = await request(app).get("/api/alumnos");

        assert.strictEqual(respuesta.status, 401);
    });

    await suite.test("rechaza los datos de alumno inválidos", async () => {
        const respuesta = await request(app)
            .post("/api/alumnos")
            .set("x-api-key", process.env.API_KEY)
            .send({ nombre: "Ana" });

        assert.strictEqual(respuesta.status, 400);
        assert.strictEqual(respuesta.body.mensaje, "Los datos del alumno no son válidos");
        assert.ok(Array.isArray(respuesta.body.errores) && respuesta.body.errores.length > 0);
    });

    await suite.test("registra un alumno válido", async () => {
        const respuesta = await request(app)
            .post("/api/alumnos")
            .set("x-api-key", process.env.API_KEY)
            .send(alumno);

        assert.strictEqual(respuesta.status, 201);
        assert.deepStrictEqual(respuesta.body, {
            mensaje: "Alumno registrado",
            alumno,
        });
    });

    await suite.test("consulta el alumno registrado por número de control", async () => {
        const respuesta = await request(app)
            .get(`/api/alumnos/${alumno.numeroControl}`)
            .set("x-api-key", process.env.API_KEY);

        assert.strictEqual(respuesta.status, 200);
        assert.deepStrictEqual(respuesta.body, alumno);
    });
});

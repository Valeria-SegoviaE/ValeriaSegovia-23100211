process.env.NODE_ENV = "test";
if (!process.env.API_KEY) {
    process.env.API_KEY = "test-api-key";
}

const { expect } = require("chai");
const request = require("supertest");
const app = require("../index");

describe("API de alumnos", () => {
    const alumno = {
        nombre: "Valeria Segovia",
        numeroControl: "23100211",
        edad: 21,
        carrera: "Ingeniería en Sistemas Computacionales",
    };

    it("rechaza solicitudes sin API Key", async () => {
        const respuesta = await request(app).get("/api/alumnos");

        expect(respuesta.status).to.equal(401);
    });

    it("rechaza solicitudes con una API Key inválida", async () => {
        const respuesta = await request(app)
            .get("/api/alumnos")
            .set("x-api-key", "clave-invalida");

        expect(respuesta.status).to.equal(401);
    });

    it("rechaza los datos de alumno inválidos", async () => {
        const respuesta = await request(app)
            .post("/api/alumnos")
            .set("x-api-key", process.env.API_KEY)
            .send({ nombre: "Valeria" });

        expect(respuesta.status).to.equal(400);
        expect(respuesta.body.mensaje).to.equal("Los datos del alumno no son válidos");
        expect(respuesta.body.errores).to.be.an("array").that.is.not.empty;
    });

    it("registra un alumno válido", async () => {
        const respuesta = await request(app)
            .post("/api/alumnos")
            .set("x-api-key", process.env.API_KEY)
            .send(alumno);

        expect(respuesta.status).to.equal(201);
        expect(respuesta.headers["content-type"]).to.match(/application\/json/);
        expect(respuesta.headers["x-fecha-solicitud"]).to.be.a("string").that.is.not.empty;
        expect(respuesta.body).to.deep.equal({
            mensaje: "Alumno registrado",
            alumno,
        });
    });

    it("incluye el alumno registrado al consultar la lista", async () => {
        const respuesta = await request(app)
            .get("/api/alumnos")
            .set("x-api-key", process.env.API_KEY);

        expect(respuesta.status).to.equal(200);
        expect(respuesta.body).to.be.an("array").that.deep.includes(alumno);
    });

    it("consulta el alumno registrado por número de control", async () => {
        const respuesta = await request(app)
            .get(`/api/alumnos/${alumno.numeroControl}`)
            .set("x-api-key", process.env.API_KEY);

        expect(respuesta.status).to.equal(200);
        expect(respuesta.body).to.deep.equal(alumno);
    });

    it("devuelve 404 al consultar un número de control inexistente", async () => {
        const respuesta = await request(app)
            .get("/api/alumnos/no-existe")
            .set("x-api-key", process.env.API_KEY);

        expect(respuesta.status).to.equal(404);
        expect(respuesta.body).to.deep.equal({ mensaje: "No se encontró el alumno" });
    });
});

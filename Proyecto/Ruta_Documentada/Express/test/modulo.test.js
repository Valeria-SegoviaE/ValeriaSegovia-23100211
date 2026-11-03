process.env.NODE_ENV = "test";
if (!process.env.API_KEY) {
    process.env.API_KEY = "test-api-key";
}

const { expect } = require("chai");
const request = require("supertest");
const app = require("../index");

describe("API de alumnos", () => {
    const alumno = {
        nombre: "Ana Pérez",
        numeroControl: "23100211",
        edad: 21,
        carrera: "API REST",
    };

    it("rechaza solicitudes sin API Key", async () => {
        const respuesta = await request(app).get("/api/alumnos");

        expect(respuesta.status).to.equal(401);
    });

    it("rechaza los datos de alumno inválidos", async () => {
        const respuesta = await request(app)
            .post("/api/alumnos")
            .set("x-api-key", process.env.API_KEY)
            .send({ nombre: "Ana" });

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
        expect(respuesta.body).to.deep.equal({
            mensaje: "Alumno registrado",
            alumno,
        });
    });

    it("consulta el alumno registrado por número de control", async () => {
        const respuesta = await request(app)
            .get(`/api/alumnos/${alumno.numeroControl}`)
            .set("x-api-key", process.env.API_KEY);

        expect(respuesta.status).to.equal(200);
        expect(respuesta.body).to.deep.equal(alumno);
    });
});

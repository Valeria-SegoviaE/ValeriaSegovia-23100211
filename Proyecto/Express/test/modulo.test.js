process.env.NODE_ENV = "test";
if (!process.env.API_KEY) {
    process.env.API_KEY = "test-api-key";
}

const { expect } = require("chai");
const request = require("supertest");
const app = require("../index");

const db = require("../config/db");

const clave = () => process.env.API_KEY;
const autenticado = (peticion) => peticion.set("x-api-key", clave());

describe("API de alumnos (CRUD sobre la base de datos)", () => {
    const alumno = {
        nombre: "Valeria Segovia",
        numeroControl: "23100211",
        edad: 21,
        carrera: "Ingeniería en Sistemas Computacionales",
    };
    let id;

    it("rechaza solicitudes sin API Key (401)", async () => {
        const respuesta = await request(app).get("/api/alumnos");
        expect(respuesta.status).to.equal(401);
    });

    it("rechaza solicitudes con una API Key inválida (401)", async () => {
        const respuesta = await request(app).get("/api/alumnos").set("x-api-key", "incorrecta");
        expect(respuesta.status).to.equal(401);
    });

    it("responde el estado de la base de datos sin API Key", async () => {
        const respuesta = await request(app).get("/api/salud");
        expect(respuesta.status).to.equal(200);
        expect(respuesta.body.baseDeDatos).to.equal("conectada");
    });

    it("POST rechaza datos inválidos (400)", async () => {
        const respuesta = await autenticado(request(app).post("/api/alumnos")).send({
            nombre: "Va",
            numeroControl: "1",
            edad: 10,
            carrera: "",
        });
        expect(respuesta.status).to.equal(400);
        expect(respuesta.body.errores).to.be.an("array").that.is.not.empty;
    });

    it("POST rechaza campos obligatorios faltantes (400)", async () => {
        const respuesta = await autenticado(request(app).post("/api/alumnos")).send({});
        expect(respuesta.status).to.equal(400);
        expect(respuesta.body.errores).to.have.length(4);
    });

    it("POST registra un alumno (201) y devuelve su id", async () => {
        const respuesta = await autenticado(request(app).post("/api/alumnos")).send(alumno);

        expect(respuesta.status).to.equal(201);
        expect(respuesta.headers["content-type"]).to.match(/application\/json/);
        expect(respuesta.body.mensaje).to.equal("Alumno registrado");
        expect(respuesta.body.alumno).to.include(alumno);
        expect(respuesta.body.alumno.id).to.be.a("number");
        id = respuesta.body.alumno.id;
    });

    it("el registro realmente quedó en la base de datos", async () => {
        const { rows } = await db.query("select * from alumnos where id = $1", [id]);
        expect(rows).to.have.length(1);
        expect(rows[0].numero_control).to.equal(alumno.numeroControl);
    });

    it("POST rechaza una matrícula duplicada (409)", async () => {
        const respuesta = await autenticado(request(app).post("/api/alumnos")).send(alumno);
        expect(respuesta.status).to.equal(409);
        expect(respuesta.body.error.code).to.equal("ERROR_CONFLICTO");
    });

    it("GET lista incluye al alumno registrado (200)", async () => {
        const respuesta = await autenticado(request(app).get("/api/alumnos"));
        expect(respuesta.status).to.equal(200);
        expect(respuesta.body).to.be.an("array").that.deep.includes({ id, ...alumno });
    });

    it("GET por ID devuelve el alumno (200)", async () => {
        const respuesta = await autenticado(request(app).get(`/api/alumnos/${id}`));
        expect(respuesta.status).to.equal(200);
        expect(respuesta.body).to.deep.equal({ id, ...alumno });
    });

    it("GET por ID inexistente devuelve 404", async () => {
        const respuesta = await autenticado(request(app).get("/api/alumnos/999999"));
        expect(respuesta.status).to.equal(404);
        expect(respuesta.body).to.deep.equal({ mensaje: "No se encontró el alumno" });
    });

    it("GET con ID no numérico devuelve 400", async () => {
        const respuesta = await autenticado(request(app).get("/api/alumnos/abc"));
        expect(respuesta.status).to.equal(400);
    });

    it("GET con ID fuera de rango devuelve 400 (no 500)", async () => {
        const respuesta = await autenticado(request(app).get("/api/alumnos/99999999999"));
        expect(respuesta.status).to.equal(400);
    });

    it("PUT actualiza un alumno (200) y se refleja en la base", async () => {
        const cambios = { ...alumno, nombre: "Valeria Segovia E.", edad: 22, carrera: "Mecatrónica" };
        const respuesta = await autenticado(request(app).put(`/api/alumnos/${id}`)).send(cambios);

        expect(respuesta.status).to.equal(200);
        expect(respuesta.body.alumno).to.deep.equal({ id, ...cambios });

        const { rows } = await db.query("select nombre, edad, carrera from alumnos where id = $1", [id]);
        expect(rows[0]).to.deep.equal({ nombre: "Valeria Segovia E.", edad: 22, carrera: "Mecatrónica" });
    });

    it("PUT valida los datos antes de actualizar (400)", async () => {
        const respuesta = await autenticado(request(app).put(`/api/alumnos/${id}`)).send({ ...alumno, edad: 5 });
        expect(respuesta.status).to.equal(400);
    });

    it("PUT con ID inexistente devuelve 404", async () => {
        const respuesta = await autenticado(request(app).put("/api/alumnos/999999")).send(alumno);
        expect(respuesta.status).to.equal(404);
    });

    it("PUT rechaza la matrícula de otro alumno (409)", async () => {
        const otro = { nombre: "Otro Alumno", numeroControl: "23100555", edad: 20, carrera: "Sistemas" };
        const creado = await autenticado(request(app).post("/api/alumnos")).send(otro);

        const respuesta = await autenticado(request(app).put(`/api/alumnos/${creado.body.alumno.id}`)).send({
            ...otro,
            numeroControl: alumno.numeroControl,
        });
        expect(respuesta.status).to.equal(409);

        await autenticado(request(app).delete(`/api/alumnos/${creado.body.alumno.id}`));
    });

    it("DELETE con ID inexistente devuelve 404", async () => {
        const respuesta = await autenticado(request(app).delete("/api/alumnos/999999"));
        expect(respuesta.status).to.equal(404);
    });

    it("DELETE elimina el alumno (200) y desaparece de la base", async () => {
        const respuesta = await autenticado(request(app).delete(`/api/alumnos/${id}`));
        expect(respuesta.status).to.equal(200);
        expect(respuesta.body.mensaje).to.equal("Alumno eliminado");

        const { rows } = await db.query("select 1 from alumnos where id = $1", [id]);
        expect(rows).to.have.length(0);

        const consulta = await autenticado(request(app).get(`/api/alumnos/${id}`));
        expect(consulta.status).to.equal(404);
    });

    it("devuelve 500 controlado si falla la base de datos", async () => {
        const original = db.query;
        db.query = async () => {
            throw new Error("fallo simulado");
        };
        try {
            const respuesta = await autenticado(request(app).get("/api/alumnos"));
            expect(respuesta.status).to.equal(500);
            expect(respuesta.body.error.code).to.equal("ERROR_INTERNO");
            expect(JSON.stringify(respuesta.body)).to.not.include("fallo simulado");
        } finally {
            db.query = original;
        }
    });
});

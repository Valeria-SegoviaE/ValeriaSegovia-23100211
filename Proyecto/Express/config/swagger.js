const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const PORT = Number(process.env.PORT) || 3000;
const urlServidor = process.env.API_URL
    || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    || `https://localhost:${PORT}`;

const swaggerOptions = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "API REST de Valeria Segovia",
            version: "1.0.0",
            description: [
                "![Portada de la API REST de Valeria Segovia](/api-portada.svg)",
                "",
                "API REST académica con CRUD de alumnos en PostgreSQL (Supabase), consultar usuarios en formato HAL y cargar o recuperar imágenes.",
                "",
                "- **Responsable:** Valeria Segovia",
                "- **Versión:** 1.0.0",
                "- **Tecnologías:** Node.js, Express y OpenAPI 3.0",
                "- **Protocolo:** HTTPS",
                "- **Autenticación:** API Key en el encabezado `x-api-key`"
            ].join("\n"),
            contact: { name: "Valeria Segovia" },
            license: { name: "Proyecto académico" }
        },
        servers: [
            {
                url: urlServidor,
                description: process.env.VERCEL || process.env.API_URL
                    ? "Servidor desplegado"
                    : "Servidor HTTPS local"
            }
        ],
        security: [{ ApiKeyAuth: [] }],
        tags: [
            { name: "Alumnos", description: "CRUD de alumnos sobre PostgreSQL (Supabase)." },
            { name: "Usuarios", description: "Recursos HAL de usuarios." },
            { name: "Sistema", description: "Estado de la API y la base de datos." }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "x-api-key",
                    description: "Introduce el valor configurado en la variable de entorno API_KEY."
                }
            },
            parameters: {
                AlumnoId: {
                    in: "path",
                    name: "id",
                    required: true,
                    description: "ID del alumno (entero positivo).",
                    schema: { type: "integer", minimum: 1, example: 1 }
                }
            },
            schemas: {
                Alumno: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1, description: "ID generado por la base de datos" },
                        nombre: { type: "string", minLength: 4, example: "Ana Pérez" },
                        numeroControl: { type: "string", minLength: 6, maxLength: 10, example: "23100211" },
                        edad: { type: "integer", minimum: 17, maximum: 60, example: 21 },
                        carrera: { type: "string", example: "Ingeniería en Sistemas Computacionales" }
                    }
                },
                NuevoAlumno: {
                    type: "object",
                    required: ["nombre", "numeroControl", "edad", "carrera"],
                    properties: {
                        nombre: { type: "string", minLength: 4, example: "Ana Pérez" },
                        numeroControl: { type: "string", minLength: 6, maxLength: 10, example: "23100999" },
                        edad: { type: "integer", minimum: 17, maximum: 60, example: 20 },
                        carrera: { type: "string", example: "Ingeniería en Sistemas Computacionales" }
                    }
                },
                RespuestaAlumno: {
                    type: "object",
                    properties: {
                        mensaje: { type: "string", example: "Alumno registrado" },
                        alumno: { $ref: "#/components/schemas/Alumno" }
                    }
                },
                ErrorValidacion: {
                    type: "object",
                    properties: {
                        mensaje: { type: "string", example: "Los datos del alumno no son válidos" },
                        errores: { type: "array", items: { type: "string" }, example: ["El nombre es obligatorio"] }
                    }
                },
                Error: {
                    type: "object",
                    properties: {
                        error: {
                            type: "object",
                            properties: {
                                status: { type: "integer", example: 500 },
                                code: { type: "string", example: "ERROR_INTERNO" },
                                message: { type: "string", example: "Ocurrió un error interno del servidor." }
                            }
                        }
                    }
                },
                RespuestaUsuario: {
                    type: "object",
                    properties: {
                        mensaje: { type: "string", example: "Hola Valeria" },
                        edad: { type: "string", example: "21" },
                        carrera: { type: "string", example: "API REST" },
                        _links: {
                            type: "object",
                            additionalProperties: {
                                type: "object",
                                properties: { href: { type: "string", example: "/api/usuario" } }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: [
        path.join(__dirname, "..", "index.js"),
        path.join(__dirname, "..", "src", "app.js"),
        path.join(__dirname, "..", "routes", "*.js").split(path.sep).join("/")
    ]
};

module.exports = swaggerJsdoc(swaggerOptions);

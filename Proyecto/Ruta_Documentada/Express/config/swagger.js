const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const PORT = Number(process.env.PORT) || 3000;

const swaggerOptions = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "API REST de Valeria Segovia",
            version: "1.0.0",
            description: [
                "![Portada de la API REST de Valeria Segovia](/api-portada.svg)",
                "",
                "API REST académica para consultar y registrar alumnos, consultar usuarios en formato HAL y cargar o recuperar imágenes.",
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
        servers: [{ url: `https://localhost:${PORT}`, description: "Servidor HTTPS local" }],
        security: [{ ApiKeyAuth: [] }],
        tags: [
            { name: "Alumnos", description: "Consulta y registro de alumnos." },
            { name: "Usuarios", description: "Recursos HAL de usuarios." }
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
            schemas: {
                Alumno: {
                    type: "object",
                    required: ["nombre", "numeroControl", "edad", "carrera"],
                    properties: {
                        nombre: { type: "string", minLength: 4, example: "Ana Pérez" },
                        numeroControl: { type: "string", minLength: 6, maxLength: 10, example: "23100211" },
                        edad: { type: "integer", minimum: 17, maximum: 60, example: 21 },
                        carrera: { type: "string", example: "API REST" }
                    }
                },
                NuevoAlumno: {
                    type: "object",
                    required: ["nombre", "numeroControl", "edad", "carrera"],
                    properties: {
                        nombre: { type: "string", minLength: 4, example: "Ana Pérez" },
                        numeroControl: { type: "string", minLength: 6, maxLength: 10, example: "23100211" },
                        edad: { type: "integer", minimum: 17, maximum: 60, example: 21 },
                        carrera: { type: "string", example: "API REST" }
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
        path.join(__dirname, "..", "routes", "*.js").split(path.sep).join("/")
    ]
};

module.exports = swaggerJsdoc(swaggerOptions);

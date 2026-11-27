# API REST con Express y API Key

- **Responsable:** Valeria Segovia
- **Versión:** 1.0.0
- **Tecnologías:** Node.js, Express y OpenAPI 3
- **Protocolo:** HTTPS
- **Autenticación:** API Key en el encabezado `x-api-key`

API REST académica para consultar y registrar alumnos, consultar recursos de
usuarios. Las rutas protegidas
requieren que la variable de entorno `API_KEY` esté configurada en el servidor.
La aplicación Express está en `src/app.js`; `index.js` conserva el arranque HTTPS
del servidor.

## Swagger / OpenAPI

Inicia el servidor y abre `https://localhost:3000/api-docs` para explorar y probar
los endpoints en Swagger UI, `https://localhost:3000/json` para consultar la
especificación en formato JSON o `https://localhost:3000/docs` para Stoplight Elements.
Las vistas de documentación cargan la misma especificación OpenAPI, disponible en
`https://localhost:3000/api-docs.json`, que se genera desde los bloques `@swagger`
de las rutas. Stoplight Elements carga sus recursos visuales desde un CDN; requiere
conexión a Internet para mostrarse.

En Swagger UI, selecciona **Authorize** e introduce el valor de `API_KEY` para
probar los endpoints protegidos. Si configuraste otro puerto mediante `PORT`,
reemplaza `3000` en las direcciones anteriores. Las rutas de usuarios solo están
disponibles entre las 07:00 y las 14:59, según la hora local del servidor.
En Vercel, Swagger usa la URL del deployment actual; puedes definir `API_URL`
para establecer una URL base personalizada.

## Generar la documentación

Instala JSDoc globalmente con `npm install -g jsdoc` y ejecuta:

```sh
npm run doc
```

La documentación HTML se genera en la carpeta `out/`.

## Ejecutar las pruebas

Las pruebas de integración de la API usan Mocha, Chai y Supertest. Ejecútalas con:

```sh
npm run test
```

## Base de datos (PostgreSQL en Supabase)

Los alumnos se guardan en PostgreSQL. El esquema está en `db/schema.sql`.

1. Crea un proyecto en [Supabase](https://supabase.com) y espera a que esté en estado *Healthy*.
2. En **SQL Editor** pega el contenido de `db/schema.sql` y ejecútalo (o corre `npm run db:init`).
3. Copia la cadena de conexión (botón **Connect** > *Session pooler*) en `DATABASE_URL`.
4. Copia `.env.example` a `.env`, llena `API_KEY` y `DATABASE_URL`, y ejecuta `npm start`.
5. Verifica la conexión en `GET /api/salud` (no requiere API Key).

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/salud` | Estado de la API y la base de datos |
| GET | `/api/alumnos` | Listar alumnos |
| GET | `/api/alumnos/:id` | Consultar un alumno |
| POST | `/api/alumnos` | Registrar alumno (409 si la matrícula ya existe) |
| PUT | `/api/alumnos/:id` | Actualizar alumno |
| DELETE | `/api/alumnos/:id` | Eliminar alumno |

Las pruebas (`npm test`) usan una base en memoria (`pg-mem`), no tocan Supabase.

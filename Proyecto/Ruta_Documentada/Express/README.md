# API REST con Express y API Key

- **Responsable:** Valeria Segovia
- **Versión:** 1.0.0
- **Tecnologías:** Node.js, Express y OpenAPI 3
- **Protocolo:** HTTPS
- **Autenticación:** API Key en el encabezado `x-api-key`

API REST académica para consultar y registrar alumnos, consultar recursos de
usuarios. Las rutas protegidas
requieren que la variable de entorno `API_KEY` esté configurada en el servidor.

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

## Generar la documentación

Instala JSDoc globalmente con `npm install -g jsdoc` y ejecuta:

```sh
npm run doc
```

La documentación HTML se genera en la carpeta `out/`.
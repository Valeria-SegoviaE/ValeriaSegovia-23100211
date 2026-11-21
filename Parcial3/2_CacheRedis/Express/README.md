# API REST con caché Redis

La ruta `GET /api/alumnos` requiere el encabezado `x-api-key` y guarda la lista
en Redis durante 60 segundos con la clave `alumnos:listado`. La respuesta
incluye `X-Cache: MISS` cuando se consulta el origen y se guarda en Redis, y
`X-Cache: HIT` cuando se devuelve desde Redis. Al registrar un alumno con
`POST /api/alumnos`, la clave de la lista se invalida para que el siguiente GET
guarde la lista actualizada. El middleware `middleware/cache.js` aplica esta
lógica a la ruta GET; `middleware/autenticacion.js` valida la API Key.

## Requisitos

- Node.js
- Redis en ejecución

Configura las variables de entorno copiando `.env.example` a `.env` y revisa
que `REDIS_URL` apunte a tu servidor Redis. Para Redis local, la dirección
predeterminada es `redis://127.0.0.1:6379`. Si Redis no está iniciado, arráncalo,
por ejemplo con Docker:

```sh
docker run --name redis-cache -p 6379:6379 -d redis
```

Desde esta carpeta instala las dependencias e inicia el servidor HTTPS:

```sh
npm install
npm start
```

## Probar el caché en Thunder Client

1. Inicia Redis y, desde esta carpeta, ejecuta `npm start`.
2. En Thunder Client crea una petición **GET** a
   `https://localhost:3102/api/alumnos`.
3. En **Headers**, agrega `x-api-key` con el valor configurado en `API_KEY` en
   tu archivo `.env`. Si Thunder Client avisa que el certificado HTTPS local no
   es de confianza, permite el certificado autofirmado para desarrollo local.
4. Envía la petición. La primera respuesta debe incluir `X-Cache: MISS`; envíala
   otra vez antes de que pasen 60 segundos y debe incluir `X-Cache: HIT`.
5. En RedisInsight abre la conexión `127.0.0.1:6379`, selecciona `db0` y
   actualiza la vista **Browse**. Debe aparecer la clave
   `alumnos:listado` con la respuesta JSON almacenada. La clave expira después
   de 60 segundos.

La lista comienza vacía, así que inicialmente el valor guardado puede ser
`[]`. Para probar con datos, envía primero un **POST** a la misma URL con los
mismos headers y este cuerpo JSON:

```json
{
  "nombre": "Ana Pérez",
  "numeroControl": "23100211",
  "edad": 21,
  "carrera": "API REST"
}
```

El POST responde `201` e invalida el caché anterior; el siguiente GET almacena
y devuelve la lista actualizada.

Explora también la documentación de la API en
`https://localhost:3102/api-docs`.

## Pruebas

Las pruebas unitarias usan un cliente Redis simulado y no requieren una instancia
Redis activa:

```sh
npm test
```

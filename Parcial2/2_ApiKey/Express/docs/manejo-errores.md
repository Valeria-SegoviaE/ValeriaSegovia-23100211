# Manejo centralizado de errores

## Funcionamiento

La aplicación envía los errores con `next(error)`. Después de las rutas, `middlewares/errores.js` registra el detalle técnico con Winston y devuelve únicamente una respuesta segura y uniforme:

```json
{
  "error": {
    "status": 400,
    "code": "ERROR_VALIDACION",
    "message": "Los datos enviados no son válidos."
  }
}
```

El stack trace, consultas, rutas internas y otros detalles técnicos no se envían al cliente.

## Uso

### Error síncrono

```js
try {
    const resultado = realizarOperacion();
    res.json(resultado);
} catch (error) {
    next(error);
}
```

### Promesas y async/await

```js
promesa()
    .then((resultado) => res.json(resultado))
    .catch((error) => next(error));
```

```js
router.get("/datos", async (req, res, next) => {
    try {
        const datos = await obtenerDatos();
        res.json(datos);
    } catch (error) {
        next(error);
    }
});
```

En callbacks, el primer parámetro es el error:

```js
operacion((error, resultado) => {
    if (error) return next(error);
    res.json(resultado);
});
```

Los errores de base de datos se manejan igual: se capturan y se envían a `next(error)`. El logger conserva el detalle técnico y el cliente recibe `ERROR_INTERNO` o un código específico seguro.

## Códigos HTTP

| Código | Uso | Solución habitual |
| --- | --- | --- |
| 400 | Datos inválidos o error de validación | Revisar cuerpo, parámetros y formato |
| 401 | Usuario no autenticado | Enviar credenciales válidas |
| 403 | Sin permisos o acceso fuera de horario | Solicitar permisos o usar el horario permitido |
| 404 | Ruta o recurso inexistente | Revisar URL e identificador |
| 409 | Conflicto con el estado actual | Revisar duplicados o estado del recurso |
| 415 | Formato de petición incorrecto | Usar `application/json` cuando corresponda |
| 500 | Error inesperado del servidor | Consultar `logs/errores.log` |
| 503 | Servicio temporalmente no disponible | Revisar dependencias y volver a intentar |

## Errores comunes

- **404 Not Found:** la ruta no existe o el recurso fue eliminado. Comprueba la URL y el identificador.
- **400 Bad Request:** los datos no cumplen las reglas esperadas. Corrige el cuerpo o los parámetros.
- **401 Unauthorized:** falta autenticación válida. Envía las credenciales requeridas.
- **403 Forbidden:** la identidad no tiene permisos o la solicitud está fuera del horario configurado. Revisa permisos y horario.
- **409 Conflict:** el cambio choca con otro estado, por ejemplo un registro duplicado. Revisa los datos existentes.
- **500 Internal Server Error:** ocurrió una excepción inesperada. Consulta el log sin mostrarlo al cliente.
- **Error de conexión con la base de datos:** la BD no responde o la configuración es incorrecta. Verifica disponibilidad y configuración sin registrar credenciales.
- **Error de validación:** faltan campos o tienen formato incorrecto. Devuelve `next(error)` con estado 400.
- **Error de Promesa:** una promesa fue rechazada. Agrega `.catch(next)`.
- **Error de async/await:** una operación falló dentro de una función asíncrona. Usa `try/catch` y `next(error)`.

## Logs

Winston escribe errores en `logs/errores.log`, excepciones no controladas en `logs/excepciones.log` y rechazos de promesas en `logs/rechazos.log`. Los archivos incluyen fecha, nivel, usuario disponible, método, ruta, estado y diagnóstico técnico; no deben contener contraseñas, tokens ni credenciales.
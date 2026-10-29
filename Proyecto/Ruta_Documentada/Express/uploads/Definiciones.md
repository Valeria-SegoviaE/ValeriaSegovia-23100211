# Definiciones de API REST

![Comunicacion](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80)


## ¿Qué es una API?

![Personas](https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80)

Una **API** (*Application Programming Interface* o **Interfaz de Programación de Aplicaciones**) es un conjunto de reglas, métodos y definiciones que permite que diferentes aplicaciones o sistemas se comuniquen entre sí.

Una API funciona como un intermediario: recibe una solicitud de una aplicación, la procesa y devuelve una respuesta. De esta manera, un sistema puede utilizar funciones o datos de otro sistema sin conocer cómo está implementado internamente.

> **Ejemplo** | Una aplicación móvil de clima puede utilizar una API para solicitar la temperatura actual a un servidor. La aplicación realiza una petición y la API devuelve los datos solicitados.


## ¿Qué es REST?

![Codigo](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80)

**REST** (*Representational State Transfer* o **Transferencia de Estado Representacional**) es un estilo arquitectónico para diseñar servicios web que permiten la comunicación entre sistemas a través de HTTP.

REST organiza la información como **recursos**, los cuales se identifican mediante URLs. Por ejemplo, en una API de usuarios, cada usuario puede considerarse un recurso accesible mediante una dirección como `/usuarios/1`.

> **Ejemplo** | Una aplicación podría realizar la siguiente petición para obtener el usuario con identificador 25:

```http
GET /usuarios/25
```

> El servidor podría responder:

```json
{
	"id": 25,
	"nombre": "Juan",
	"correo": "juan@example.com"
}
```

> De esta manera, el cliente obtiene la representación del recurso solicitado.

REST utiliza los métodos HTTP para realizar operaciones sobre los recursos:

| Metodo HTTP | Accion | Ejemplo |
|---|---|---|
| **GET** | Obtener informacion | `GET /usuarios` |
| **POST** | Crear un recurso nuevo | `POST /usuarios` |
| **PUT** | Actualizar completamente un recurso | `PUT /usuarios/1` |
| **PATCH** | Actualizar parcialmente un recurso | `PATCH /usuarios/1` |
| **DELETE** | Eliminar un recurso | `DELETE /usuarios/1` |

Entre las características principales de REST se encuentran:

- **Cliente-servidor:** el cliente y el servidor tienen responsabilidades separadas.
- **Sin estado (*stateless*):** cada petición contiene toda la información necesaria para ser procesada; el servidor no depende de peticiones anteriores.
- **Uso de representaciones:** los recursos pueden enviarse en formatos como JSON o XML.
- **Interfaz uniforme:** se utilizan reglas y métodos estandarizados para interactuar con los recursos.
- **Cacheable:** las respuestas pueden indicar si es posible almacenarlas temporalmente para mejorar el rendimiento.


## ¿Qué significa RESTful?

El término **RESTful** se refiere a un servicio web o una API que implementa los principios y restricciones del estilo arquitectónico REST.

Una API RESTful utiliza correctamente los métodos HTTP, identifica los recursos mediante URLs claras, mantiene las peticiones sin estado y devuelve representaciones de los recursos, generalmente en formato JSON.

Por ejemplo, una API RESTful para administrar productos podría utilizar las siguientes rutas:

| Método | Ruta | Operación |
|---|---|---|
| GET | `/productos` | Obtener todos los productos |
| GET | `/productos/1` | Obtener el producto con identificador 1 |
| POST | `/productos` | Crear un producto |
| PUT | `/productos/1` | Actualizar el producto con identificador 1 |
| DELETE | `/productos/1` | Eliminar el producto con identificador 1 |

En resumen, **REST** es el estilo arquitectónico y **RESTful** describe a las APIs o servicios que siguen ese estilo.

![RESTful API](https://www.weblantropia.com/wp-content/uploads/2016/05/RESTful-API-1-1260x710.jpg)


## Referencias bibliográficas

1. ¿Qué es una interfaz de programación de aplicaciones (API)? https://aws.amazon.com/es/what-is/api/
2. Qué es REST y cómo responde a un request https://dev.to/aws/que-es-rest-y-como-responde-a-un-request-22ll
3. ¿Qué es una API RESTful? https://aws.amazon.com/es/what-is/restful-api/
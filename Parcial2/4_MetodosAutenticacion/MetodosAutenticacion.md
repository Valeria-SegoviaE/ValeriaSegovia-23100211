# Métodos de autenticación en una API REST

Una API REST necesita comprobar quién realiza una solicitud y qué recursos puede usar. Para ello puede recibir credenciales directamente o validar un token. Cada método tiene ventajas y riesgos distintos.

![Métodos de autenticación](https://media.licdn.com/dms/image/v2/D4E22AQHD72ns90r6QA/feedshare-shrink_480/feedshare-shrink_480/0/1718598344387?e=1792627200&v=beta&t=DUSRs0O6RxMY4VXSI0B7cMh3v73wsOrjYN0AGkPUOEk)

## 1. Autenticación básica (Basic)

Envía un **nombre de usuario y una contraseña** en el encabezado `Authorization`. Las credenciales se codifican en Base64, pero **codificar no es cifrar**: pueden recuperarse fácilmente.

```http
Authorization: Basic dXN1YXJpbzpjb250cmFzZW5h
```

Debe utilizarse únicamente sobre **HTTPS**. Como el cliente suele enviar las credenciales en cada solicitud, es importante protegerlas y no reutilizar contraseñas.

## 2. Autenticación Digest

Envía una respuesta calculada a partir de la contraseña y datos de la solicitud, en lugar de enviar la contraseña directamente. Usa valores como un *nonce* para dificultar la repetición de una respuesta capturada.

Fue una alternativa a Basic, pero hoy es poco común y tiene limitaciones. No reemplaza HTTPS: el cifrado de la conexión sigue siendo necesario para proteger toda la comunicación.

## 3. Token Bearer

Envía un **token de acceso** en el encabezado `Authorization`. “Bearer” significa que quien posee el token puede usarlo, por lo que debe mantenerse en secreto.

```http
Authorization: Bearer <token_de_acceso>
```

Es un esquema de presentación del token, no un formato específico: el token puede ser opaco o tener un formato como JWT. Si se filtra, otra persona podría utilizarlo hasta que expire o sea revocado.

## 4. API Key

Es una clave asignada a una aplicación, proyecto o cliente para identificarlo y controlar su acceso a la API. Según el servicio, puede enviarse en un encabezado o como parámetro; es preferible usar un encabezado:

```http
X-API-Key: <tu_clave>
```

Es sencilla de implementar, pero una clave estática puede filtrarse. Por sí sola, normalmente **no demuestra qué persona está usando la aplicación**. Conviene limitar sus permisos y rotarla periódicamente.

## 5. JSON Web Token (JWT)

Es un formato compacto para representar información (*claims*) en un token. Habitualmente tiene tres partes: encabezado, contenido y firma. El servidor verifica la firma para comprobar que el token no fue alterado y puede revisar datos como el usuario y la fecha de expiración.

Un JWT firmado **no está necesariamente cifrado**: su contenido puede ser legible. No se deben incluir contraseñas ni información secreta.

```http
Authorization: Bearer <jwt>
```

JWT y Bearer no son alternativas excluyentes: es común enviar un JWT usando el esquema Bearer. Deben comprobarse su firma, emisor, audiencia y expiración.

## 6. OAuth 2.0

Es un marco de **autorización delegada**. Permite que una aplicación obtenga permisos limitados para acceder a recursos, sin tener que recibir directamente la contraseña del usuario. Por ejemplo, una persona puede autorizar a una aplicación a consultar ciertos datos.

OAuth 2.0 define flujos para obtener tokens de acceso, que luego suelen enviarse como Bearer. **OAuth por sí solo no es un protocolo de autenticación de usuarios**; OpenID Connect (OIDC) añade esa capacidad sobre OAuth 2.0.

## Comparación rápida

| Método | Qué presenta | Uso habitual | Consideración clave |
| --- | --- | --- | --- |
| Basic | Usuario y contraseña codificados | Servicios sencillos o pruebas | Requiere HTTPS; Base64 no cifra |
| Digest | Respuesta calculada con credenciales y nonce | Sistemas antiguos | Poco común; no sustituye HTTPS |
| Bearer | Token de acceso | APIs protegidas | Cualquiera con el token puede usarlo |
| API Key | Clave de una aplicación o cliente | Identificar proyectos y controlar consumo | No suele identificar por sí sola a una persona |
| JWT | Token con datos y firma | Sesiones y acceso entre servicios | Firmado no significa cifrado |
| OAuth 2.0 | Permisos delegados mediante tokens | Acceso de aplicaciones a recursos | Para autenticar usuarios, usar OIDC |

## Buenas prácticas

- Usa **HTTPS** en todos los métodos.
- No incluyas contraseñas, API keys ni tokens en URLs, capturas o repositorios.
- Almacena las credenciales de forma segura y limita los permisos de cada clave o token.
- Define expiración y revocación para los tokens; rota las API keys cuando sea necesario.
- Valida cada credencial en el servidor. Ocultar una ruta en el cliente no protege la API.

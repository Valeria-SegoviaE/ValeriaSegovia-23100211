# Definición y estructura de un archivo WSDL para Web Services SOAP

## Introducción

**WSDL (Web Services Description Language)** es un lenguaje basado en XML utilizado para describir la estructura y funcionamiento de un Web Service SOAP.

Un archivo WSDL define qué operaciones ofrece un servicio, qué datos recibe, qué respuestas devuelve, cómo se deben enviar los mensajes y dónde se encuentra disponible el servicio.

La estructura de un archivo WSDL está formada principalmente por los siguientes elementos:

- `definitions`
- `types`
- `message`
- `portType`
- `binding`
- `service`

![WSLD](https://media.geeksforgeeks.org/wp-content/uploads/20200427212414/WSDL.png)
---

# Estructura general de un archivo WSDL

Un documento WSDL tiene la siguiente estructura básica:

```xml
<definitions>

    <types>
        <!-- Definición de tipos de datos -->
    </types>

    <message>
        <!-- Definición de mensajes -->
    </message>

    <portType>
        <!-- Operaciones disponibles del servicio -->
    </portType>

    <binding>
        <!-- Protocolo y formato de comunicación -->
    </binding>

    <service>
        <!-- Dirección donde está publicado el servicio -->
    </service>

</definitions>
```

## ¿Qué es un Web Service?

Un **Web Service** o **Servicio Web** es una tecnología que permite la comunicación e intercambio de información entre diferentes aplicaciones a través de una red, generalmente utilizando Internet.

Su principal objetivo es permitir que sistemas desarrollados con diferentes lenguajes de programación o plataformas puedan comunicarse entre sí sin necesidad de conocer su implementación interna.

Por ejemplo:

- Un sistema desarrollado en Java puede consumir un servicio creado en C#.
- Una aplicación móvil puede consultar información almacenada en un servidor mediante un servicio web.
- Dos empresas pueden compartir información mediante servicios publicados en Internet.

Los Web Services utilizan estándares abiertos como XML, HTTP y protocolos específicos como SOAP para garantizar la interoperabilidad entre sistemas.


![Web Service SOAP](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80)

---

# ¿Qué es SOAP?

![SOAP Protocol](https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80)

**SOAP** (*Simple Object Access Protocol* o **Protocolo Simple de Acceso a Objetos**) es un protocolo basado en XML utilizado para intercambiar información estructurada entre aplicaciones.

SOAP define una serie de reglas para crear mensajes que permiten realizar solicitudes y recibir respuestas entre un cliente y un servidor.

Un mensaje SOAP está formado principalmente por:

| Elemento | Descripción |
|---|---|
| Envelope | Elemento principal que contiene todo el mensaje |
| Header | Información adicional como seguridad o autenticación |
| Body | Contiene la solicitud o respuesta del servicio |
| Fault | Contiene información sobre errores |

Ejemplo de estructura SOAP:

```xml
<soap:Envelope>

    <soap:Header>
    </soap:Header>

    <soap:Body>

        <ConsultarProducto>
            <id>10</id>
        </ConsultarProducto>

    </soap:Body>

</soap:Envelope>
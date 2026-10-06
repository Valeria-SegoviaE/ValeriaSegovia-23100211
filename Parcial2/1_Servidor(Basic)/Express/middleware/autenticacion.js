const basicAuth = require("basic-auth");

const usuarioEsperado = process.env.AUTH_USER;
const contrasenaEsperada = process.env.AUTH_PASSWORD;

const autenticacionBasica = (req, res, next) => {
    if (!usuarioEsperado || !contrasenaEsperada) {
        return res.status(500).json({
            error: "Configura las variables AUTH_USER y AUTH_PASSWORD"
        });
    }

    const credenciales = basicAuth(req);

    if (
        !credenciales ||
        credenciales.name !== usuarioEsperado ||
        credenciales.pass !== contrasenaEsperada
    ) {
        res.set("WWW-Authenticate", 'Basic realm="API REST"');
        return res.status(401).json({ error: "Autenticación requerida" });
    }

    return next();
};

module.exports = autenticacionBasica;
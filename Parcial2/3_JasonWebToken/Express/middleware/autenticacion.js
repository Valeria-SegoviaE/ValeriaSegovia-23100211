const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
    throw new Error("Configura la variable JWT_SECRET en el archivo .env");
}

const crearErrorAutenticacion = () => {
    const error = new Error("Token inválido o ausente");
    error.status = 401;
    error.publicMessage = "Debes enviar un token Bearer válido.";
    return error;
};

module.exports = (req, res, next) => {
    const authorization = req.get("authorization") || "";
    const coincidencia = authorization.match(/^Bearer\s+(.+)$/i);

    if (!coincidencia) return next(crearErrorAutenticacion());

    try {
        req.user = jwt.verify(coincidencia[1], process.env.JWT_SECRET);
        next();
    } catch (_error) {
        next(crearErrorAutenticacion());
    }
};
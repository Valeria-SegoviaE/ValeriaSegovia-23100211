const { apiKeyAuth } = require("@vpriem/express-api-key-auth");

if (!process.env.API_KEY) {
    throw new Error("Configura la variable API_KEY");
}

module.exports = apiKeyAuth([process.env.API_KEY]);
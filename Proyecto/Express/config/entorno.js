const path = require("path");

const enVercel = Boolean(process.env.VERCEL);

const carpetaUploads = enVercel
    ? path.join("/tmp", "uploads")
    : path.join(__dirname, "..", "uploads");

module.exports = { enVercel, carpetaUploads };

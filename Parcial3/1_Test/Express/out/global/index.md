---
title: Globals
kind: global
longname: Globals
---

# Globals

---

## Instance Methods

<MemberHeading id="horariopermitido" depth="3" name="horarioPermitido" sig="horarioPermitido(horaInicio: number, horaFin: number): function" />

<MemberMeta sourceHref="/source/validaciones-js/#L25" sourceLabel="validaciones.js:25" />

Crea un middleware que permite solicitudes únicamente dentro de un horario.

**Parameters**

- `horaInicio` (number) — Hora inicial permitida, de 0 a 23.
- `horaFin` (number) — Hora final excluida, de 1 a 24.

**Returns**

- `function` — Middleware de validación del horario.

**Throws**

- `Error` — Reenvía a `next` un error con estado 403 si la solicitud está fuera del horario.

**Example**

```js
const { horarioPermitido } = require("./middleware/validaciones");app.use("/api/usuario", horarioPermitido(7, 15));
```

- **Since:** 1.0.0
- **Version:** 1.0.0
- **Author:** Valeria Segovia

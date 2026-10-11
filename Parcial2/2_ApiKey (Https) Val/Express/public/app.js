const keyForm = document.querySelector("#key-form");
const keyInput = document.querySelector("#api-key");
const keyMessage = document.querySelector("#key-message");
const loginScreen = document.querySelector("#login-screen");
const studentsScreen = document.querySelector("#students-screen");
const studentForm = document.querySelector("#student-form");
const formMessage = document.querySelector("#form-message");
const studentRoutes = document.querySelector("#student-routes");
const routeMessage = document.querySelector("#route-message");
const studentResult = document.querySelector("#student-result");
let apiKey = "";

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, ...options.headers },
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.mensaje || data.error?.message || "No se pudo completar la petición");
    }
    return data;
}

async function loadStudents() {
    try {
        const alumnos = await apiRequest("/api/alumnos");
        studentRoutes.replaceChildren();

        for (const alumno of alumnos) {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = `/api/alumnos/${encodeURIComponent(alumno.numeroControl)}`;
            link.textContent = `GET ${link.pathname}`;
            link.addEventListener("click", (event) => {
                event.preventDefault();
                consultStudent(alumno.numeroControl);
            });
            item.append(link);
            studentRoutes.append(item);
        }
    } catch (error) {
        routeMessage.textContent = error.message;
    }
}

async function consultStudent(numeroControl) {
    try {
        const alumno = await apiRequest(`/api/alumnos/${encodeURIComponent(numeroControl)}`);
        studentResult.textContent = JSON.stringify(alumno, null, 2);
        studentResult.hidden = false;
    } catch (error) {
        routeMessage.textContent = error.message;
    }
}

keyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    apiKey = keyInput.value.trim();

    try {
        await apiRequest("/api/validar-key", { method: "POST" });
        loginScreen.hidden = true;
        studentsScreen.hidden = false;
        await loadStudents();
    } catch (error) {
        apiKey = "";
        keyMessage.textContent = error.message;
        keyMessage.className = "message error";
    }
});

studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const datos = new FormData(studentForm);

    try {
        const data = await apiRequest("/api/alumnos", {
            method: "POST",
            body: JSON.stringify({
                nombre: datos.get("nombre"),
                numeroControl: datos.get("numeroControl"),
                edad: Number(datos.get("edad")),
                carrera: datos.get("carrera"),
            }),
        });
        formMessage.textContent = data.mensaje;
        formMessage.className = "message success";
        studentForm.reset();
        await loadStudents();
    } catch (error) {
        formMessage.textContent = error.message;
        formMessage.className = "message error";
    }
});

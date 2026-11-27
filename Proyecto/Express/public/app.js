const keyForm = document.querySelector("#key-form");
const keyInput = document.querySelector("#api-key");
const keyMessage = document.querySelector("#key-message");
const loginScreen = document.querySelector("#login-screen");
const studentsScreen = document.querySelector("#students-screen");
const studentForm = document.querySelector("#student-form");
const lookupForm = document.querySelector("#lookup-form");
const lookupIdInput = document.querySelector("#lookup-id");
const formTitle = document.querySelector("#form-title");
const formMessage = document.querySelector("#form-message");
const cancelEditButton = document.querySelector("#cancel-edit");
const studentRoutes = document.querySelector("#student-routes");
const routeMessage = document.querySelector("#route-message");
const studentResult = document.querySelector("#student-result");
let apiKey = "";
let editingStudentId = null;

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, ...options.headers },
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data.mensaje || data.error?.message || "No se pudo completar la petición");
        error.status = response.status;
        error.data = data;
        throw error;
    }
    return data;
}

function showMessage(element, message, type, errors = []) {
    element.replaceChildren();
    element.className = `message ${type}`;
    element.append(document.createTextNode(message));

    if (errors.length > 0) {
        const list = document.createElement("ul");
        for (const error of errors) {
            const item = document.createElement("li");
            item.textContent = error;
            list.append(item);
        }
        element.append(list);
    }
}

function showRequestError(element, error) {
    const errores = error.data?.errores;
    showMessage(element, error.message, "error", Array.isArray(errores) ? errores : []);
}

function clearMessage(element) {
    element.replaceChildren();
    element.className = "message";
}

async function loadStudents() {
    try {
        const alumnos = await apiRequest("/api/alumnos");
        studentRoutes.replaceChildren();

        for (const alumno of alumnos) {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = `/api/alumnos/${encodeURIComponent(alumno.id)}`;
            link.textContent = `GET ${link.pathname}`;
            link.addEventListener("click", (event) => {
                event.preventDefault();
                consultStudent(alumno.id);
            });

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Editar";
            editButton.addEventListener("click", () => startEditing(alumno));

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Eliminar";
            deleteButton.addEventListener("click", () => deleteStudent(alumno));

            item.append(link, document.createTextNode(" "), editButton, document.createTextNode(" "), deleteButton);
            studentRoutes.append(item);
        }
        return true;
    } catch (error) {
        showRequestError(routeMessage, error);
        return false;
    }
}

async function consultStudent(id) {
    clearMessage(routeMessage);
    studentResult.hidden = true;
    studentResult.textContent = "";
    try {
        const alumno = await apiRequest(`/api/alumnos/${encodeURIComponent(id)}`);
        studentResult.textContent = JSON.stringify(alumno, null, 2);
        studentResult.hidden = false;
    } catch (error) {
        showRequestError(routeMessage, error);
    }
}

function startEditing(alumno) {
    editingStudentId = alumno.id;
    formTitle.textContent = "Editar alumno";
    studentForm.elements.nombre.value = alumno.nombre;
    studentForm.elements.numeroControl.value = alumno.numeroControl;
    studentForm.elements.edad.value = alumno.edad;
    const carreraSelect = studentForm.elements.carrera;
    carreraSelect.querySelector("option[data-current-career]")?.remove();
    if (!Array.from(carreraSelect.options).some((option) => option.value === alumno.carrera)) {
        const carreraActual = document.createElement("option");
        carreraActual.value = alumno.carrera;
        carreraActual.textContent = `${alumno.carrera} (actual)`;
        carreraActual.dataset.currentCareer = "true";
        carreraSelect.append(carreraActual);
    }
    carreraSelect.value = alumno.carrera;
    studentForm.querySelector('button[type="submit"]').textContent = "Actualizar";
    cancelEditButton.hidden = false;
    clearMessage(formMessage);
    studentForm.elements.nombre.focus();
}

function finishEditing() {
    editingStudentId = null;
    studentForm.elements.carrera.querySelector("option[data-current-career]")?.remove();
    studentForm.reset();
    formTitle.textContent = "Registrar alumno";
    studentForm.querySelector('button[type="submit"]').textContent = "Guardar";
    cancelEditButton.hidden = true;
}

async function deleteStudent(alumno) {
    if (!confirm(`¿Eliminar al alumno ${alumno.nombre}?`)) return;

    try {
        const data = await apiRequest(`/api/alumnos/${encodeURIComponent(alumno.id)}`, { method: "DELETE" });
        if (editingStudentId === alumno.id) finishEditing();
        if (await loadStudents()) showMessage(routeMessage, data.mensaje, "success");
    } catch (error) {
        showRequestError(routeMessage, error);
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
        showMessage(keyMessage, error.message, "error");
    }
});

lookupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = lookupIdInput.value.trim();
    if (!id) {
        showMessage(routeMessage, "Ingresa el ID del alumno que quieres consultar.", "error");
        return;
    }
    consultStudent(id);
});

cancelEditButton.addEventListener("click", () => {
    finishEditing();
    clearMessage(formMessage);
});

studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const datos = new FormData(studentForm);
    const alumno = {
        nombre: datos.get("nombre"),
        numeroControl: datos.get("numeroControl"),
        edad: Number(datos.get("edad")),
        carrera: datos.get("carrera"),
    };
    const editando = editingStudentId !== null;

    try {
        const data = await apiRequest(
            editando ? `/api/alumnos/${encodeURIComponent(editingStudentId)}` : "/api/alumnos",
            {
                method: editando ? "PUT" : "POST",
                body: JSON.stringify(alumno),
            }
        );
        finishEditing();
        showMessage(formMessage, data.mensaje, "success");
        clearMessage(routeMessage);
        await loadStudents();
    } catch (error) {
        showRequestError(formMessage, error);
    }
});


import { validateTaskForm } from "./validation.js";

import {
    getTasks,
    createTask,
    updateTask,
    getArchivedTasks,
    archiveTask,
    restoreTask
} from "./api.js";

// Almacenamiento temporal de las tareas recibidas desde el backend
let tasks = [];
let archivedTasks = [];

// Estados disponibles para las tareas
const estados = {
    TODO: "Por hacer",
    IN_PROGRESS: "En proceso",
    REVIEW: "Revisión",
    DONE: "Hecho"
};

// Convertir el estado del formulario al código utilizado por el backend
function obtenerCodigoEstado(estado) {
    const equivalencias = {
        "POR HACER": "TODO",
        "EN PROCESO": "IN_PROGRESS",
        "REVISIÓN": "REVIEW",
        "HECHO": "DONE"
    };

    return equivalencias[estado];
}

// Cargar componentes HTML externos
async function cargarComponente(id, archivo) {
    const contenedor = document.getElementById(id);

    try {
        const respuesta = await fetch(archivo);

        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar ${archivo}`);
        }

        contenedor.innerHTML = await respuesta.text();

    } catch (error) {
        console.error("Error al cargar el componente:", error);
        contenedor.textContent = "No se pudo cargar el formulario.";
        throw error;
    }
}

// Crear tarjeta de una tarea activa
function crearTarjeta(task) {
    const columna = document.createElement("div");
    columna.className = "col-12 col-md-6 col-lg-4";

    const tarjeta = document.createElement("article");
    tarjeta.className = "card h-100 shadow-sm";
    tarjeta.dataset.taskId = task.id;

    const contenido = document.createElement("div");
    contenido.className = "card-body";

    const titulo = document.createElement("h3");
    titulo.className = "card-title h5";
    titulo.textContent = task.name;

    const descripcion = document.createElement("p");
    descripcion.className = "card-text";
    descripcion.textContent = task.description;

    const responsable = document.createElement("p");
    responsable.className = "mb-2";
    responsable.textContent = `Asignado a: ${task.assignedTo}`;

    const fecha = document.createElement("p");
    fecha.className = "mb-2";
    fecha.textContent = `Fecha de entrega: ${task.dueDate}`;

    const etiquetaEstado = document.createElement("label");
    etiquetaEstado.className = "form-label";
    etiquetaEstado.textContent = "Estado de la tarea";
    etiquetaEstado.htmlFor = `estado-${task.id}`;

    const selectorEstado = document.createElement("select");
    selectorEstado.className = "form-select mb-3";
    selectorEstado.id = `estado-${task.id}`;

    Object.entries(estados).forEach(([codigo, nombre]) => {
        const opcion = document.createElement("option");
        opcion.value = codigo;
        opcion.textContent = nombre;
        selectorEstado.appendChild(opcion);
    });

    selectorEstado.value = task.status;

    const mensaje = document.createElement("p");
    mensaje.className = "small mb-2";
    mensaje.setAttribute("role", "status");

    // Actualizar estado de la tarea
    selectorEstado.addEventListener("change", async () => {
        const estadoAnterior = task.status;
        const nuevoEstado = selectorEstado.value;

        const tareaActualizada = {
            name: task.name,
            description: task.description,
            assignedTo: task.assignedTo,
            dueDate: task.dueDate,
            status: nuevoEstado
        };

        selectorEstado.disabled = true;
        mensaje.textContent = "Actualizando estado...";

        try {
            const respuesta = await updateTask(task.id, tareaActualizada);

            const indice = tasks.findIndex(
                tarea => tarea.id === task.id
            );

            if (indice !== -1) {
                tasks[indice] = respuesta;
            }

            selectorEstado.value = respuesta.status;

            mensaje.textContent = "Estado actualizado correctamente.";
            mensaje.className = "small mb-2 text-success";

        } catch (error) {
            selectorEstado.value = estadoAnterior;

            mensaje.textContent = error.message;
            mensaje.className = "small mb-2 text-danger";

            console.error("Error al actualizar el estado:", error);

        } finally {
            selectorEstado.disabled = false;
        }
    });

    // Botón para archivar tarea
    const botonArchivar = document.createElement("button");
    botonArchivar.type = "button";
    botonArchivar.className = "btn btn-outline-secondary btn-sm";
    botonArchivar.textContent = "Archivar";

    botonArchivar.addEventListener("click", async () => {
        botonArchivar.disabled = true;
        selectorEstado.disabled = true;

        mensaje.textContent = "Archivando tarea...";
        mensaje.className = "small mb-2 text-muted";

        try {
            await archiveTask(task.id);

            tasks = tasks.filter(
                tarea => tarea.id !== task.id
            );

            renderizarTareas();
            await cargarTareasArchivadas();

        } catch (error) {
            mensaje.textContent = error.message;
            mensaje.className = "small mb-2 text-danger";

            botonArchivar.disabled = false;
            selectorEstado.disabled = false;

            console.error("Error al archivar la tarea:", error);
        }
    });

    contenido.append(
        titulo,
        descripcion,
        responsable,
        fecha,
        etiquetaEstado,
        selectorEstado,
        mensaje,
        botonArchivar
    );

    tarjeta.appendChild(contenido);
    columna.appendChild(tarjeta);

    return columna;
}

// Crear tarjeta de una tarea archivada
function crearTarjetaArchivada(task) {
    const columna = document.createElement("div");
    columna.className = "col-12 col-md-6 col-lg-4";

    const tarjeta = document.createElement("article");
    tarjeta.className = "card h-100 shadow-sm";

    const contenido = document.createElement("div");
    contenido.className = "card-body";

    const titulo = document.createElement("h3");
    titulo.className = "card-title h5";
    titulo.textContent = task.name;

    const descripcion = document.createElement("p");
    descripcion.className = "card-text";
    descripcion.textContent = task.description;

    const responsable = document.createElement("p");
    responsable.className = "mb-2";
    responsable.textContent = `Asignado a: ${task.assignedTo}`;

    const fecha = document.createElement("p");
    fecha.className = "mb-2";
    fecha.textContent = `Fecha de entrega: ${task.dueDate}`;

    const estado = document.createElement("p");
    estado.className = "mb-3";
    estado.textContent = `Estado: ${estados[task.status]}`;

    const mensaje = document.createElement("p");
    mensaje.className = "small mb-2";
    mensaje.setAttribute("role", "status");

    // Botón para restaurar tarea
    const botonRestaurar = document.createElement("button");
    botonRestaurar.type = "button";
    botonRestaurar.className = "btn btn-outline-primary btn-sm";
    botonRestaurar.textContent = "Restaurar";

    botonRestaurar.addEventListener("click", async () => {
        botonRestaurar.disabled = true;
        mensaje.textContent = "Restaurando tarea...";
        mensaje.className = "small mb-2 text-muted";

        try {
            await restoreTask(task.id);

            archivedTasks = archivedTasks.filter(
                tarea => tarea.id !== task.id
            );

            await cargarTareas();
            renderizarTareasArchivadas();

        } catch (error) {
            mensaje.textContent = error.message;
            mensaje.className = "small mb-2 text-danger";

            botonRestaurar.disabled = false;

            console.error("Error al restaurar la tarea:", error);
        }
    });

    contenido.append(
        titulo,
        descripcion,
        responsable,
        fecha,
        estado,
        mensaje,
        botonRestaurar
    );

    tarjeta.appendChild(contenido);
    columna.appendChild(tarjeta);

    return columna;
}

// Mostrar tareas activas
function renderizarTareas() {
    const lista = document.getElementById("taskList");

    lista.replaceChildren();

    tasks.forEach(task => {
        lista.appendChild(crearTarjeta(task));
    });

    actualizarMensajeVacio();
}

// Mostrar tareas archivadas
function renderizarTareasArchivadas() {
    const lista = document.getElementById("archivedTaskList");
    const mensaje = document.getElementById("archivedEmptyMessage");

    lista.replaceChildren();

    archivedTasks.forEach(task => {
        lista.appendChild(crearTarjetaArchivada(task));
    });

    mensaje.hidden = archivedTasks.length > 0;
}

// Actualizar mensaje cuando no hay tareas activas
function actualizarMensajeVacio() {
    const lista = document.getElementById("taskList");
    const mensaje = document.getElementById("emptyMessage");

    mensaje.hidden = lista.children.length > 0;
}

// Consultar tareas activas desde el backend
async function cargarTareas() {
    try {
        tasks = await getTasks();
        renderizarTareas();

    } catch (error) {
        console.error("Error al cargar las tareas:", error);

        document.getElementById("emptyMessage").textContent =
            "No fue posible cargar las tareas del servidor.";
    }
}

// Consultar tareas archivadas desde el backend
async function cargarTareasArchivadas() {
    try {
        archivedTasks = await getArchivedTasks();
        renderizarTareasArchivadas();

    } catch (error) {
        console.error("Error al cargar tareas archivadas:", error);

        const mensaje = document.getElementById("archivedEmptyMessage");
        mensaje.textContent = "No fue posible cargar las tareas archivadas.";
        mensaje.hidden = false;
    }
}

// Configurar formulario para registrar tareas
function configurarFormulario() {
    const formulario = document.getElementById("taskForm");

    formulario.addEventListener("submit", async event => {
        event.preventDefault();

        const formErrors = document.getElementById("formErrors");
        const formSuccess = document.getElementById("formSuccess");

        formErrors.textContent = "";
        formSuccess.textContent = "";

        if (!validateTaskForm()) {
            return;
        }

        const nuevaTarea = {
            name: document.getElementById("name").value.trim(),
            description: document.getElementById("description").value.trim(),
            assignedTo: document.getElementById("assignedTo").value,
            dueDate: document.getElementById("date").value,
            status: obtenerCodigoEstado(
                document.getElementById("status").value
            )
        };

        try {
            const tareaCreada = await createTask(nuevaTarea);

            tasks.push(tareaCreada);
            renderizarTareas();

            formSuccess.textContent = "¡Tarea agregada correctamente!";
            formulario.reset();

        } catch (error) {
            console.error("Error al crear la tarea:", error);
            formErrors.textContent = error.message;
        }
    });
}

// Inicializar aplicación
async function inicializarApp() {
    try {
        await cargarComponente(
            "formulario-container",
            "./formulario.html"
        );

        configurarFormulario();

        await cargarTareas();
        await cargarTareasArchivadas();

    } catch (error) {
        console.error("No fue posible iniciar la aplicación:", error);
    }
}

inicializarApp();


import { validateTaskForm } from "./validation.js";
import { TaskManager } from "./taskManager.js";

// Crear el administrador de tareas.
const taskManager = new TaskManager();

// Cargar un componente HTML externo.
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

// Crear la tarjeta HTML de una tarea.
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
    titulo.textContent = task.nombre;

    const descripcion = document.createElement("p");
    descripcion.className = "card-text";
    descripcion.textContent = task.descripcion;

    const responsable = document.createElement("p");
    responsable.className = "mb-2";
    responsable.textContent = `Asignado a: ${task.asignadoA}`;

    const fecha = document.createElement("p");
    fecha.className = "mb-2";
    fecha.textContent = `Fecha de entrega: ${task.fechaDeEntrega}`;

    const estado = document.createElement("p");
    estado.className = "mb-3";
    estado.textContent = `Estado: ${task.estado}`;

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "btn btn-outline-danger btn-sm";
    botonEliminar.textContent = "Eliminar";

    // Eliminar la tarea cuando se pulse el botón.
    botonEliminar.addEventListener("click", () => {
        const eliminada = taskManager.deleteTask(task.id);

        if (eliminada) {
            columna.remove();
            actualizarMensajeVacio();
        }
    });

    contenido.append(
        titulo,
        descripcion,
        responsable,
        fecha,
        estado,
        botonEliminar
    );

    tarjeta.appendChild(contenido);
    columna.appendChild(tarjeta);

    return columna;
}

// Dibujar todas las tareas almacenadas en el array.
function renderizarTareas() {
    const lista = document.getElementById("taskList");

    lista.replaceChildren();

    taskManager.getAllTasks().forEach(task => {
        lista.appendChild(crearTarjeta(task));
    });

    actualizarMensajeVacio();
}

// Mostrar u ocultar el mensaje cuando no hay tareas.
function actualizarMensajeVacio() {
    const lista = document.getElementById("taskList");
    const mensaje = document.getElementById("emptyMessage");

    mensaje.hidden = lista.children.length > 0;
}

// Conectar los eventos del formulario.
function configurarFormulario() {
    const formulario = document.getElementById("taskForm");

    formulario.addEventListener("submit", event => {
        console.log("Se detectó el envío del formulario");
        event.preventDefault();

        const formErrors = document.getElementById("formErrors");
        const formSuccess = document.getElementById("formSuccess");

        formErrors.textContent = "";
        formSuccess.textContent = "";

        // Validar antes de crear la tarea.
        if (!validateTaskForm()) {
            return;
        }

        // Obtener los valores del formulario.
        const nuevaTarea = {
            nombre: document.getElementById("name").value.trim(),
            descripcion: document.getElementById("description").value.trim(),
            asignadoA: document.getElementById("assignedTo").value,
            fechaDeEntrega: document.getElementById("date").value,
            estado: document.getElementById("status").value
        };

        // Guardar la tarea en el administrador.
        const tareaCreada = taskManager.addTask(nuevaTarea);
        console.log("Tarea creada:", tareaCreada);
        console.log("Todas las tareas:", taskManager.getAllTasks());

        // Dibujar la tarjeta en la interfaz.
        document.getElementById("taskList")
            .appendChild(crearTarjeta(tareaCreada));

        actualizarMensajeVacio();

        // Confirmar y limpiar el formulario.
        formSuccess.textContent = "¡Tarea agregada correctamente!";
        formulario.reset();
    });
}

// Inicializar la aplicación.
async function inicializarApp() {
    await cargarComponente("formulario-container", "./formulario.html");
    configurarFormulario();
    renderizarTareas();
}

inicializarApp();

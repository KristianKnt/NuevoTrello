
export class TaskManager {
    constructor() {
        // Array donde almacenaremos todas las tareas.
        this.tasks = [];

        // Contador para generar identificadores únicos.
        this.nextId = 1;
    }

    // Guardar las tareas y el contador de identificadores.
    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        localStorage.setItem("nextId", String(this.nextId));
    }

    // Cargar las tareas y el contador si ya existen datos guardados.
    load() {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks !== null) {
            this.tasks = JSON.parse(savedTasks);
        }

        const savedNextId = localStorage.getItem("nextId");
        if (savedNextId !== null) {
            this.nextId = Number(savedNextId);
        }
    }

    render(container) {
        container.replaceChildren();

        this.tasks.forEach(task => {
            const columna = document.createElement("div");
            columna.className = "col-12 col-md-6 col-lg-4";

            const tarjeta = document.createElement("article");
            tarjeta.className = "card h-100 shadow-sm";
            tarjeta.dataset.taskId = task.id;
            tarjeta.innerHTML = `
                <div class="card-body">
                    <h3 class="card-title h5"></h3>
                    <p class="card-text description"></p>
                    <p class="mb-2 assignee"></p>
                    <p class="mb-2 due-date"></p>
                    <p class="mb-3 status"></p>
                    <div class="task-actions">
                        <button type="button" class="btn btn-success btn-sm done-button">Marcar como hecha</button>
                        <button type="button" class="btn btn-outline-danger btn-sm delete-button">Eliminar</button>
                    </div>
                </div>`;

            tarjeta.querySelector(".card-title").textContent = task.nombre;
            tarjeta.querySelector(".description").textContent = task.descripcion;
            tarjeta.querySelector(".assignee").textContent = `Asignado a: ${task.asignadoA}`;
            tarjeta.querySelector(".due-date").textContent = `Fecha de entrega: ${task.fechaDeEntrega}`;
            tarjeta.querySelector(".status").textContent = `Estado: ${task.estado}`;

            columna.appendChild(tarjeta);
            container.appendChild(columna);
        });
    }

    findTaskById(taskId) {
        return this.tasks.find(task => task.id === Number(taskId));
    }

    // 1. Obtener todas las tareas.
    getAllTasks() {
        return this.tasks;
    }

    // 2. Obtener tareas según su estado.
    getTasksWithStatus(status) {
        return this.tasks.filter(task => task.estado === status);
    }

    // 3. Agregar una tarea nueva.
    addTask(task) {
        const newTask = {
            id: this.nextId++,
            nombre: task.nombre,
            descripcion: task.descripcion,
            asignadoA: task.asignadoA,
            fechaDeEntrega: task.fechaDeEntrega,
            estado: task.estado
        };

        this.tasks.push(newTask);

        return newTask;
    }

    // 4. Eliminar una tarea por su ID.
    deleteTask(taskId) {
        const initialLength = this.tasks.length;

        this.tasks = this.tasks.filter(
            task => task.id !== Number(taskId)
        );

        return this.tasks.length < initialLength;
    }

    // 5. Actualizar el estado de una tarea.
    updateTask(taskId, status) {
        const task = this.tasks.find(
            task => task.id === Number(taskId)
        );

        if (!task) {
            return false;
        }

        task.estado = status;

        return true;
    }

    // 6. Cambiar la persona asignada.
    assignTask(taskId, assignee) {
        const task = this.tasks.find(
            task => task.id === Number(taskId)
        );

        if (!task) {
            return false;
        }

        task.asignadoA = assignee;

        return true;
    }
}

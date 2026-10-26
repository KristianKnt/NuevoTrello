
export class TaskManager {
    constructor() {
        // Array donde almacenaremos todas las tareas.
        this.tasks = [];

        // Contador para generar identificadores únicos.
        this.nextId = 1;
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

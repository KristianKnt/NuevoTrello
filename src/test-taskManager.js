
import { TaskManager } from "./taskManager.js";

const manager = new TaskManager();

const task1 = manager.addTask({
    nombre: "Desarrollar página web",
    descripcion: "Crear la página principal del proyecto",
    asignadoA: "Cristian Rojas",
    fechaDeEntrega: "2026-10-30",
    estado: "EN PROCESO"
});

const task2 = manager.addTask({
    nombre: "Diseñar formulario",
    descripcion: "Diseñar el formulario de registro de tareas",
    asignadoA: "Peter Pan",
    fechaDeEntrega: "2026-10-31",
    estado: "POR HACER"
});

console.log("Todas las tareas:", manager.getAllTasks());

console.log(
    "Tareas pendientes:",
    manager.getTasksWithStatus("POR HACER")
);

manager.updateTask(task1.id, "HECHO");
manager.assignTask(task2.id, "Cristian Rojas");

console.log("Después de actualizar:", manager.getAllTasks());

manager.deleteTask(task1.id);

console.log("Después de eliminar:", manager.getAllTasks());

console.log("JSON:", JSON.stringify(manager.getAllTasks()));

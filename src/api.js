
const API_URL = "http://localhost:8080/api/tasks";

// Consultar todas las tareas
export async function getTasks() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("No fue posible consultar las tareas");
    }

    return await response.json();
}

// Crear una tarea
export async function createTask(task) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error("No fue posible crear la tarea");
    }

    return await response.json();
}

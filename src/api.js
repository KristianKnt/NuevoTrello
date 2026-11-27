
const API_URL = "http://localhost:8080/api/tasks";

// Consultar todas las tareas activas
export async function getTasks() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("No fue posible consultar las tareas");
    }

    return await response.json();
}

// Consultar tareas archivadas
export async function getArchivedTasks() {
    const response = await fetch(`${API_URL}/archived`);

    if (!response.ok) {
        throw new Error("No fue posible consultar las tareas archivadas");
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

// Actualizar una tarea existente
export async function updateTask(id, task) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("La tarea que intentas actualizar no existe");
        }

        throw new Error("No fue posible actualizar la tarea");
    }

    return await response.json();
}

// Archivar una tarea
export async function archiveTask(id) {
    const response = await fetch(`${API_URL}/${id}/archive`, {
        method: "PATCH"
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("La tarea que intentas archivar no existe");
        }

        throw new Error("No fue posible archivar la tarea");
    }

    return await response.json();
}

// Restaurar una tarea archivada
export async function restoreTask(id) {
    const response = await fetch(`${API_URL}/${id}/restore`, {
        method: "PATCH"
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("La tarea que intentas restaurar no existe");
        }

        throw new Error("No fue posible restaurar la tarea");
    }

    return await response.json();
}

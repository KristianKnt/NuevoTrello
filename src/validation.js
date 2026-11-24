
export function validateTaskForm() {
    const nombre = document.getElementById("name").value.trim();
    const descripcion = document.getElementById("description").value.trim();
    const asignadoA = document.getElementById("assignedTo").value;
    const fechaDeEntrega = document.getElementById("date").value;
    const estado = document.getElementById("status").value;

    const formErrors = document.getElementById("formErrors");
    const formSuccess = document.getElementById("formSuccess");

    // Limpiar mensajes anteriores
    formErrors.textContent = "";
    formSuccess.textContent = "";

    // Validar nombre
    if (nombre.length <= 8) {
        formErrors.textContent =
            "El nombre debe tener más de 8 caracteres.";
        return false;
    }

    // Validar descripción
    if (descripcion.length <= 15) {
        formErrors.textContent =
            "La descripción debe tener más de 15 caracteres.";
        return false;
    }

    // Validar responsable
    if (!asignadoA) {
        formErrors.textContent =
            "Debes seleccionar una persona responsable.";
        return false;
    }

    // Validar fecha
    if (!fechaDeEntrega) {
        formErrors.textContent =
            "Debes seleccionar una fecha de entrega.";
        return false;
    }

    const hoy = new Date();
    const hoyLocal = [
        hoy.getFullYear(),
        String(hoy.getMonth() + 1).padStart(2, "0"),
        String(hoy.getDate()).padStart(2, "0")
    ].join("-");

    if (fechaDeEntrega < hoyLocal) {
        formErrors.textContent =
            "La fecha de entrega no puede ser anterior a hoy.";
        return false;
    }

    // Validar estado
    if (!estado) {
        formErrors.textContent =
            "Debes seleccionar un estado.";
        return false;
    }

    return true;
}

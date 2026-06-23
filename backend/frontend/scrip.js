document
.getElementById("formulario")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const archivo =
        document.getElementById("pdf").files[0];

    if (!archivo) {
        alert("Selecciona un PDF");
        return;
    }

    const formData = new FormData();

    formData.append("pdf", archivo);

    try {

        const respuesta = await fetch(
            "http://localhost:3001/documentos/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const datos = await respuesta.json();

        document.getElementById("mensaje").innerText =
            datos.mensaje;

        console.log(datos);

    } catch (error) {

        console.error(error);

        document.getElementById("mensaje").innerText =
            "Error al subir archivo";
    }
});
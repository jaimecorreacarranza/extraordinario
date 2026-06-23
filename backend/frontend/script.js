console.log("SCRIPT NUEVO CARGADO");
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

    formData.append(
    "titulo",
    document.getElementById("titulo").value
);

formData.append(
    "tipo",
    document.getElementById("tipo").value
);

formData.append(
    "area",
    document.getElementById("area").value
);

    formData.append("pdf", archivo);

    try {

        const respuesta = await fetch(
            "http://localhost:3001/documentos/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const blob = await respuesta.blob();

        const url = window.URL.createObjectURL(blob);

        const enlace = document.createElement("a");

        enlace.href = url;
        enlace.download = "documento-validado.pdf";

        document.body.appendChild(enlace);

        enlace.click();

        enlace.remove();

        document.getElementById("mensaje").innerText =
            "PDF generado y descargado correctamente";

    } catch (error) {

        console.error(error);

        document.getElementById("mensaje").innerText =
            "Error al subir archivo";
    }
});

async function cargarDocumentos() {

    const respuesta =
        await fetch(
            "http://localhost:3001/documentos/listar"
        );

    const documentos =
        await respuesta.json();

    const tabla =
        document.getElementById(
            "tablaDocumentos"
        );

    tabla.innerHTML = "";

    documentos.forEach(doc => {

       tabla.innerHTML += `
    <tr>
        <td>${doc.iddocumentos}</td>
        <td>${doc.titulo}</td>
        <td>${doc.estado}</td>
        <td>
            <button onclick="revocar(${doc.iddocumentos})">
                Revocar
            </button>
        </td>
    </tr>
`;
    });
}

async function revocar(id) {

    await fetch(
        `http://localhost:3001/documentos/revocar/${id}`,
        {
            method: "PUT"
        }
    );

    cargarDocumentos();
}

cargarDocumentos();
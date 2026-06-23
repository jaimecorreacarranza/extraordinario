document
.getElementById("loginForm")
.addEventListener("submit", (e) => {

    e.preventDefault();

    const usuario =
        document.getElementById("usuario").value;

    const password =
        document.getElementById("password").value;

    if (
        usuario === "admin" &&
        password === "1234"
    ) {

        localStorage.setItem(
            "autenticado",
            "si"
        );

        window.location.href =
            "index.html";

    } else {

        document.getElementById("mensaje")
        .innerText =
        "Usuario o contraseña incorrectos";
    }
});
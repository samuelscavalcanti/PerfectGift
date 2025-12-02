window.onload = () => {
    fetch("../components/header.html")
        .then(res => res.text())
        .then(data => document.getElementById("header").innerHTML = data);

    fetch("../components/footer.html")
        .then(res => res.text())
        .then(data => document.getElementById("footer").innerHTML = data);
};

function gerarLinkInicial() {
    const link = "https://linkboost/ref/" + Math.random().toString(36).substring(2, 10);
    document.getElementById("linkGerado").value = link;
    document.getElementById("linkBox").style.display = "block";
}

function copiarLink() {
    const campo = document.getElementById("linkGerado");
    campo.select();
    document.execCommand("copy");
    alert("Link copiado!");
}

function gerarLinkProduto(produto) {
    const link = "https://linkboost/" + produto + "/ref-" + Math.random().toString(36).substring(2, 9);

    document.getElementById("resultado").innerHTML = `
        <div class="box">
            <p><strong>Link gerado:</strong></p>
            <input value="${link}" readonly>
        </div>
    `;
}

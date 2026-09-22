const pedidos = [];

function atualizarResumo() {
    const resumo = document.getElementById("resumo-pedido");
    if (!resumo) return;

    if (pedidos.length === 0) {
        resumo.innerHTML = '<p class="pedido-vazio">Ainda não adicionou nenhum item.</p>';
        return;
    }

    const total = pedidos.reduce((soma, item) => soma + item.preco, 0);
    resumo.innerHTML = pedidos.map((item, indice) =>
        `<div class="linha-pedido"><span>${item.nome}</span><strong>${item.preco} MT</strong><button type="button" data-remover="${indice}" aria-label="Remover ${item.nome}">Remover</button></div>`
    ).join("") + `<p class="total-pedido">Total: <strong>${total} MT</strong></p>`;

    resumo.querySelectorAll("[data-remover]").forEach((botao) => {
        botao.addEventListener("click", () => {
            pedidos.splice(Number(botao.dataset.remover), 1);
            atualizarResumo();
        });
    });
}

document.querySelectorAll(".btn-adicionar").forEach((botao) => {
    botao.addEventListener("click", () => {
        pedidos.push({
            nome: botao.dataset.nome,
            preco: Number(botao.dataset.preco)
        });
        atualizarResumo();
        document.getElementById("pedido").scrollIntoView({ behavior: "smooth" });
    });
});

const formulario = document.getElementById("form-pedido");
if (formulario) {
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const mensagem = document.getElementById("mensagem-pedido");

        if (pedidos.length === 0) {
            mensagem.textContent = "Adicione pelo menos um item antes de confirmar.";
            return;
        }

        const formularioReserva = document.getElementById("form-reserva");
        const dataReserva = document.getElementById("data-reserva");

        if (dataReserva) {
            dataReserva.min = new Date().toISOString().split("T")[0];
        }

        if (formularioReserva) {
            formularioReserva.addEventListener("submit", (evento) => {
                evento.preventDefault();
                const dados = new FormData(formularioReserva);
                const mensagem = document.getElementById("mensagem-reserva");
                mensagem.textContent = `Reserva recebida para ${dados.get("pessoas")} pessoa(s), no dia ${dados.get("data")} às ${dados.get("hora")}. A taxa de 350 MT e a referência serão validadas pelo restaurante antes da confirmação.`;
                formularioReserva.reset();
                dataReserva.min = new Date().toISOString().split("T")[0];
            });
        }

        mensagem.textContent = "Pedido preparado com sucesso. A ligação à cozinha/garçom será ativada com o servidor.";
        formulario.reset();
        pedidos.length = 0;
        atualizarResumo();
    });
}
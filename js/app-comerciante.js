document.addEventListener("DOMContentLoaded", () => {
  const session = requireAuth(["comerciante"]);
  if (!session) return;

  initLogoutButtons();
  renderHeader(session);
  renderProdutos(session);
  renderTrocas(session);
  renderEstatisticas(session);
  initFormProduto(session);
});

function renderHeader(session) {
  const lojaEl = document.getElementById("loja-nome");
  const userEl = document.getElementById("comerciante-nome");
  if (lojaEl) lojaEl.textContent = session.loja || "Minha Loja";
  if (userEl) userEl.textContent = session.nome;
}

function getProdutosComerciante(comercianteId) {
  return getProdutos().filter((p) => p.comercianteId === comercianteId);
}

function getTrocasComerciante(comercianteId) {
  return getTrocas().filter((t) => t.comercianteId === comercianteId);
}

function renderProdutos(session) {
  const container = document.getElementById("produtos-list");
  if (!container) return;

  const produtos = getProdutosComerciante(session.comercianteId);
  container.innerHTML = produtos.length
    ? produtos.map((p) => `
        <div class="comerciante-item">
          <div>
            <strong>${p.nome}</strong>
            <p>${p.descricao}</p>
            <span class="tag-pontos">${p.pontos} pontos</span>
          </div>
          <button class="btn-delete" data-produto="${p.id}">Remover</button>
        </div>
      `).join("")
    : "<p>Nenhum produto cadastrado ainda.</p>";

  container.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.produto;
      const produtos = getProdutos().filter((p) => p.id !== id);
      saveProdutos(produtos);
      renderProdutos(session);
      renderEstatisticas(session);
    });
  });
}

function renderTrocas(session) {
  const container = document.getElementById("trocas-list");
  if (!container) return;

  const trocas = getTrocasComerciante(session.comercianteId);
  container.innerHTML = trocas.length
    ? trocas.map((t) => `
        <div class="comerciante-item">
          <div>
            <strong>${t.produtoNome}</strong>
            <p>Resgatado por ${t.usuario}</p>
            <span class="tag-data">${t.data} · ${t.pontos} pts</span>
          </div>
        </div>
      `).join("")
    : "<p>Nenhuma troca realizada ainda.</p>";
}

function renderEstatisticas(session) {
  const produtos = getProdutosComerciante(session.comercianteId);
  const trocas = getTrocasComerciante(session.comercianteId);
  const pontosDistribuidos = trocas.reduce((s, t) => s + t.pontos, 0);

  const elProdutos = document.getElementById("stat-produtos");
  const elTrocas = document.getElementById("stat-trocas");
  const elPontos = document.getElementById("stat-pontos");

  if (elProdutos) elProdutos.textContent = produtos.length;
  if (elTrocas) elTrocas.textContent = trocas.length;
  if (elPontos) elPontos.textContent = pontosDistribuidos;
}

function initFormProduto(session) {
  const form = document.getElementById("form-produto");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const descricao = form.descricao.value.trim();
    const pontos = parseInt(form.pontos.value, 10);

    if (!nome || !descricao || !pontos || pontos < 1) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const produtos = getProdutos();
    produtos.push({
      id: `prod-${Date.now()}`,
      nome,
      descricao,
      pontos,
      comercianteId: session.comercianteId,
      imagem: "images/logo.png"
    });
    saveProdutos(produtos);
    form.reset();
    renderProdutos(session);
    renderEstatisticas(session);
    alert("Produto cadastrado com sucesso!");
  });
}

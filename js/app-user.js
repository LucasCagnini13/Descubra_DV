document.addEventListener("DOMContentLoaded", () => {
  const session = requireAuth(["descobridor"]);
  if (!session) return;

  initLogoutButtons();
  renderProfile(session);
  renderCheckin(session);
  renderBadges(session);
  renderHistorico(session);
  renderPlaces(session);
  renderProducts(session);
  renderRanking(session);
  initSearch();
});

function renderProfile(session) {
  const nivelEl = document.querySelector(".profile-info p");
  const yourPosition = document.querySelector(".your-position");

  if (nivelEl) nivelEl.textContent = `Nível ${session.nivel} · ${session.pontos} pts`;

  if (yourPosition) {
    const rankEl = yourPosition.querySelector("h3");
    const nameEl = yourPosition.querySelector("div h3");
    const nivelRankEl = yourPosition.querySelector("div p");
    if (rankEl) rankEl.textContent = `${session.rank || 38}°`;
    if (nameEl) nameEl.textContent = session.nome;
    if (nivelRankEl) nivelRankEl.textContent = `Nível ${session.nivel}`;
  }

  const xpFill = document.querySelector(".xp-fill");
  if (xpFill) {
    const pct = Math.min(100, (session.pontos % 500) / 5);
    xpFill.style.width = `${pct}%`;
  }
}

function renderCheckin(session) {
  const select = document.getElementById("checkin-local");
  const input = document.getElementById("checkin-codigo");
  const btn = document.getElementById("btn-checkin");
  const msg = document.getElementById("checkin-msg");

  if (!select) return;

  select.innerHTML = LOCAIS.map(
    (l) => `<option value="${l.id}">${l.nome}</option>`
  ).join("");

  btn.addEventListener("click", () => {
    const localId = select.value;
    const codigo = input.value.trim();
    const local = getLocalById(localId);
    const codigoEsperado = getCodigoDoDia(localId);
    const visitas = getVisitas(session.username);

    if (visitas.includes(localId)) {
      msg.textContent = "Você já fez check-in neste local.";
      msg.className = "checkin-msg erro";
      return;
    }

    if (codigo !== codigoEsperado) {
      msg.textContent = "Código inválido. Verifique o código do dia no local.";
      msg.className = "checkin-msg erro";
      return;
    }

    visitas.push(localId);
    setVisitas(session.username, visitas);

    const selos = getSelosDesbloqueados(session.username);
    let pontosGanhos = local.pontosCheckin;
    getSelosByLocal(localId).forEach((selo) => {
      if (!selo.requer || selos.includes(selo.requer)) {
        if (!selos.includes(selo.id)) {
          selos.push(selo.id);
          pontosGanhos += selo.pontos;
        }
      }
    });
    setSelosDesbloqueados(session.username, selos);

    const novosPontos = session.pontos + pontosGanhos;
    const novoNivel = calcularNivel(selos.length);
    updateSession({ pontos: novosPontos, nivel: novoNivel, selosCount: selos.length, visitasCount: visitas.length });

    msg.textContent = `Check-in em ${local.nome} realizado! +${pontosGanhos} pontos.`;
    msg.className = "checkin-msg sucesso";
    input.value = "";

    renderProfile(getSession());
    renderBadges(getSession());
    renderHistorico(getSession());
    renderPlaces(getSession());
  });
}

function renderBadges(session) {
  const container = document.getElementById("badges-container");
  if (!container) return;

  const desbloqueados = getSelosDesbloqueados(session.username);
  const visitas = getVisitas(session.username);

  container.innerHTML = SELOS.map((selo) => {
    const desbloqueado = desbloqueados.includes(selo.id);
    const visitouLocal = visitas.includes(selo.localId);
    let progresso = 0;
    let status = "Visite o local para desbloquear";

    if (desbloqueado) {
      progresso = 100;
      status = "Selo conquistado!";
    } else if (visitouLocal) {
      progresso = 60;
      status = "Quase lá! Complete os requisitos.";
    } else if (selo.requer && desbloqueados.includes(selo.requer)) {
      progresso = 30;
      status = "Pré-requisito ok. Visite o local.";
    }

    return `
      <div class="badge ${desbloqueado ? "badge-desbloqueado" : ""}">
        <img src="${selo.imagem}" alt="${selo.nome}" onerror="this.src='images/logo.png'">
        <h4>${selo.nome}</h4>
        <div class="progress-bar">
          <div class="xp-fill-badge" style="width:${progresso}%"></div>
        </div>
        <p>${status}</p>
      </div>
    `;
  }).join("");
}

function renderHistorico(session) {
  const visitadosEl = document.getElementById("historico-visitados");
  const naoVisitadosEl = document.getElementById("historico-nao-visitados");
  if (!visitadosEl || !naoVisitadosEl) return;

  const visitas = getVisitas(session.username);
  const visitados = LOCAIS.filter((l) => visitas.includes(l.id));
  const naoVisitados = LOCAIS.filter((l) => !visitas.includes(l.id));

  visitadosEl.innerHTML = visitados.length
    ? visitados.map((l) => `<li class="historico-item visitado">✓ ${l.nome}</li>`).join("")
    : "<li class=\"historico-item\">Nenhum local visitado ainda.</li>";

  naoVisitadosEl.innerHTML = naoVisitados.length
    ? naoVisitados.map((l) => `<li class="historico-item nao-visitado">○ ${l.nome}</li>`).join("")
    : "<li class=\"historico-item visitado\">Parabéns! Você visitou todos os locais!</li>";
}

function renderPlaces(session) {
  const container = document.getElementById("places-grid");
  if (!container) return;

  const visitas = getVisitas(session.username);
  container.innerHTML = LOCAIS.map((l) => {
    const visitado = visitas.includes(l.id);
    return `
      <div class="place-card ${visitado ? "visitado" : "nao-visitado"}" data-nome="${l.nome.toLowerCase()}">
        <img src="${l.foto}" alt="${l.nome}" onerror="this.src='images/logo.png'">
        <div class="place-info">
          <span class="place-status">${visitado ? "✓ Visitado" : "○ Não visitado"}</span>
          <h3>${l.nome}</h3>
          <p>${l.descricao}</p>
        </div>
      </div>
    `;
  }).join("");
}

function renderProducts(session) {
  const container = document.getElementById("products-grid");
  const pontosEl = document.getElementById("products-pontos");
  if (!container) return;

  const produtos = getProdutos();
  if (pontosEl) pontosEl.textContent = session.pontos;

  container.innerHTML = produtos.map((p) => {
    const podeResgatar = session.pontos >= p.pontos;
    return `
      <div class="product-card">
        <img src="${p.imagem}" alt="${p.nome}" onerror="this.src='images/logo.png'">
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <p class="product-pontos">${p.pontos} pontos</p>
        <button class="btn-resgatar" data-produto="${p.id}" ${podeResgatar ? "" : "disabled"}>
          ${podeResgatar ? "Resgatar" : "Pontos insuficientes"}
        </button>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".btn-resgatar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const produtoId = btn.dataset.produto;
      resgatarProduto(produtoId);
    });
  });
}

function resgatarProduto(produtoId) {
  const session = getSession();
  const produtos = getProdutos();
  const produto = produtos.find((p) => p.id === produtoId);
  if (!produto || session.pontos < produto.pontos) return;

  const novosPontos = session.pontos - produto.pontos;
  updateSession({ pontos: novosPontos });

  const trocas = getTrocas();
  trocas.unshift({
    id: `troca-${Date.now()}`,
    produtoId: produto.id,
    produtoNome: produto.nome,
    usuario: session.nome,
    pontos: produto.pontos,
    data: getDataHoje(),
    comercianteId: produto.comercianteId
  });
  saveTrocas(trocas);

  alert(`Você resgatou "${produto.nome}" por ${produto.pontos} pontos!`);
  renderProfile(getSession());
  renderProducts(getSession());
}

function renderRanking(session) {
  const yourPosition = document.querySelector(".your-position");
  if (yourPosition) {
    const nameEl = yourPosition.querySelector("div h3");
    if (nameEl) nameEl.textContent = session.nome;
  }
}

function initSearch() {
  const input = document.getElementById("search-input");
  const btn = document.getElementById("search-btn");
  if (!input) return;

  const filtrar = () => {
    const termo = input.value.toLowerCase().trim();
    document.querySelectorAll(".place-card").forEach((card) => {
      const nome = card.dataset.nome || "";
      card.style.display = !termo || nome.includes(termo) ? "" : "none";
    });
  };

  input.addEventListener("input", filtrar);
  if (btn) btn.addEventListener("click", filtrar);
}

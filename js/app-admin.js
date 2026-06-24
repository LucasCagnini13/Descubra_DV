document.addEventListener("DOMContentLoaded", () => {
  const session = requireAuth(["admin"]);
  if (!session) return;

  initLogoutButtons();
  renderCodigosDoDia();
  renderUsersTable();
  initAdminButtons();
});

function renderCodigosDoDia() {
  const container = document.getElementById("codigos-dia");
  if (!container) return;

  container.innerHTML = LOCAIS.map((l) => `
    <div class="place-item codigo-item">
      <div>
        <strong>${l.nome}</strong>
        <p class="codigo-data">Código válido em ${getDataHoje()}</p>
      </div>
      <code class="codigo-valor">${getCodigoDoDia(l.id)}</code>
    </div>
  `).join("");
}

function renderUsersTable() {
  const tbody = document.getElementById("users-tbody");
  if (!tbody) return;

  const roleLabels = {
    descobridor: "Descobridor",
    comerciante: "Comerciante",
    admin: "Administrador"
  };

  tbody.innerHTML = getAllUsers()
    .filter((u) => u.role !== "admin" || u.username === "admin")
    .map((u) => `
      <tr>
        <td>${u.nome}</td>
        <td>${roleLabels[u.role] || u.role}</td>
        <td>${u.nivel || "-"}</td>
        <td>Ativo</td>
        <td>
          <button class="btn-edit" data-action="editar" data-nome="${u.nome}">Editar</button>
          <button class="btn-delete" data-action="excluir" data-nome="${u.nome}">Excluir</button>
        </td>
      </tr>
    `).join("");
}

function initAdminButtons() {
  document.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const acao = btn.dataset.action;
      const nome = btn.dataset.nome || "item";
      alert(`${acao === "editar" ? "Editar" : "Excluir"}: ${nome} (simulação — sem backend).`);
    });
  });

  const btnAdd = document.querySelector(".btn-add");
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      const nome = prompt("Nome do novo ponto turístico:");
      if (nome) alert(`Local "${nome}" adicionado (simulação — sem backend).`);
    });
  }

  document.querySelectorAll(".admin-section .btn-edit:not([data-action])").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".place-item")?.querySelector("span")?.textContent || "item";
      alert(`Editar: ${item} (simulação — sem backend).`);
    });
  });

  document.querySelectorAll(".admin-section .btn-delete:not([data-action])").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".place-item")?.querySelector("span")?.textContent
        || btn.closest(".review-admin")?.querySelector("h4")?.textContent
        || "item";
      alert(`Remover: ${item} (simulação — sem backend).`);
    });
  });
}

const SESSION_KEY = "descubradv_session";

const ROLE_PAGES = {
  descobridor: "user.html",
  admin: "admin.html",
  comerciante: "comerciante.html"
};

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user) {
  const session = {
    username: user.username,
    role: user.role,
    nome: user.nome,
    nivel: user.nivel || 1,
    pontos: user.pontos || 0,
    rank: user.rank || 0,
    loja: user.loja || null,
    comercianteId: user.comercianteId || user.username
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function updateSession(updates) {
  const session = getSession();
  if (!session) return null;
  const updated = { ...session, ...updates };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  persistirProgresso(updated);
  return updated;
}

function persistirProgresso(session) {
  saveProgressoUsuario(session.username, {
    pontos: session.pontos,
    nivel: session.nivel
  });
}

function login(username, password) {
  const user = findUser(username.trim().toLowerCase());
  if (!user || user.password !== password) {
    return { ok: false, message: "Usuário ou senha incorretos." };
  }

  const visitas = getVisitas(user.username);
  const selos = getSelosDesbloqueados(user.username);
  const pontos = calcularPontosUsuario(user.username, user.pontos);
  const nivel = calcularNivelUsuario(user.username, selos.length, user.nivel);

  const session = saveSession({
    ...user,
    pontos,
    nivel,
    visitasCount: visitas.length,
    selosCount: selos.length
  });

  return { ok: true, session };
}

function calcularPontos(username) {
  const session = getSession();
  if (session && session.username === username && session.pontos !== undefined) {
    return session.pontos;
  }
  const user = findUser(username);
  return calcularPontosUsuario(username, user?.pontos || 0);
}

function calcularNivel(selosCount) {
  return calcularNivelFromSelos(selosCount);
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = "login.html";
}

function redirectByRole(role) {
  window.location.href = ROLE_PAGES[role] || "login.html";
}

function requireAuth(allowedRoles) {
  const session = getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    redirectByRole(session.role);
    return null;
  }
  return session;
}

function initLogoutButtons() {
  document.querySelectorAll("[data-logout]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  });
}

function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("usuario").value;
    const password = document.getElementById("senha").value;
    const erroEl = document.getElementById("login-erro");
    const result = login(username, password);

    if (!result.ok) {
      if (erroEl) {
        erroEl.textContent = result.message;
        erroEl.hidden = false;
      } else {
        alert(result.message);
      }
      return;
    }

    redirectByRole(result.session.role);
  });
}

function initRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.Nome.value.trim();
    const email = form.Email.value.trim();
    const senha = form.Senha.value;
    const tipo = form.Tipo.value;

    if (!nome || !email || !senha || !tipo) {
      alert("Preencha todos os campos.");
      return;
    }

    const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") || "usuario";
    const role = tipo === "2" ? "comerciante" : "descobridor";

    if (findUser(username)) {
      alert("Este e-mail já está cadastrado. Faça login.");
      window.location.href = "login.html";
      return;
    }

    registrarUsuarioExtra({
      username,
      password: senha,
      role,
      nome,
      email,
      nivel: 1,
      pontos: 0,
      loja: role === "comerciante" ? `Loja de ${nome.split(" ")[0]}` : undefined,
      comercianteId: role === "comerciante" ? username : undefined
    });

    alert("Cadastro realizado com sucesso! Faça login para continuar.");
    window.location.href = "login.html";
  });
}

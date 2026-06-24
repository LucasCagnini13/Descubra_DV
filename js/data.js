const MOCK_USERS = [
  { username: "joao", password: "123", role: "descobridor", nome: "João Silva", nivel: 2, pontos: 350, rank: 38 },
  { username: "admin", password: "admin", role: "admin", nome: "Administrador" },
  { username: "maria", password: "123", role: "comerciante", nome: "Maria Carvalho", loja: "Artesanato DV", comercianteId: "maria" }
];

const LOCAIS = [
  { id: "praca", nome: "Praça da Amizade", descricao: "Centro histórico e ponto de encontro da cidade.", foto: "images/praca.jpeg", pontosCheckin: 50 },
  { id: "moinho", nome: "Moinho Paladini", descricao: "Patrimônio histórico com paisagem encantadora.", foto: "images/moinho.jpeg", pontosCheckin: 80 },
  { id: "lago", nome: "Lago Dourado", descricao: "Trilhas e vista panorâmica para caminhadas.", foto: "images/lago.jpeg", pontosCheckin: 70 },
  { id: "gruta", nome: "Gruta Nossa Senhora", descricao: "Santuário natural de grande significado local.", foto: "images/gruta.jpeg", pontosCheckin: 60 },
  { id: "caminho", nome: "Caminho de Santiago", descricao: "Início da rota de peregrinação em Dois Vizinhos.", foto: "images/caminho.jpeg", pontosCheckin: 100 },
  { id: "cachoeira", nome: "Cachoeira do Moinho", descricao: "Cachoeira junto ao complexo do Moinho Paladini.", foto: "images/cachoeira.jpeg", pontosCheckin: 75 }
];

const SELOS = [
  { id: "selo-caminho-inicio", localId: "caminho", nome: "Chegar no começo do caminho de Santiago", imagem: "images/seloCaminho.png", pontos: 100 },
  { id: "selo-caminho-fim", localId: "caminho", nome: "Finalizar o caminho de Santiago", imagem: "images/seloConclusaoCaminho.png", pontos: 150, requer: "selo-caminho-inicio" },
  { id: "selo-gruta", localId: "gruta", nome: "Visitar a Gruta", imagem: "images/seloGruta.png", pontos: 60 },
  { id: "selo-lago", localId: "lago", nome: "Visitar o Lago Dourado", imagem: "images/seloLago.png", pontos: 70 },
  { id: "selo-moinho", localId: "moinho", nome: "Visitar o Moinho Paladini", imagem: "images/seloMoinho.png", pontos: 80 },
  { id: "selo-cachoeira", localId: "cachoeira", nome: "Visitar a Caixoeira do Moinho", imagem: "images/seloMoinhoCaixoeira.png", pontos: 75, requer: "selo-moinho" },
  { id: "selo-praca", localId: "praca", nome: "Visitar a Praça da Amizade", imagem: "images/seloPraca.png", pontos: 50 }
];

const PRODUTOS_INICIAIS = [
  { id: "prod-1", nome: "Camiseta DescubraDV", descricao: "Camiseta exclusiva do Caminho de Santiago.", pontos: 200, comercianteId: "maria", imagem: "images/logo.png" },
  { id: "prod-2", nome: "Chaveiro artesanal", descricao: "Chaveiro feito por artesãos locais.", pontos: 80, comercianteId: "maria", imagem: "images/logo.png" },
  { id: "prod-3", nome: "Caneca DV", descricao: "Caneca com mapa dos pontos turísticos.", pontos: 150, comercianteId: "maria", imagem: "images/logo.png" }
];

const TROCAS_INICIAIS = [
  { id: "troca-1", produtoId: "prod-2", produtoNome: "Chaveiro artesanal", usuario: "Carlos Oliveira", pontos: 80, data: "2026-06-20", comercianteId: "maria" }
];

const STORAGE_KEYS = {
  visitas: "descubradv_visitas",
  selos: "descubradv_selos",
  produtos: "descubradv_produtos",
  trocas: "descubradv_trocas",
  usuarios: "descubradv_usuarios_extra"
};

function getDataHoje() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function getCodigoDoDia(localId) {
  const seed = `${localId}-${getDataHoje()}-descubradv`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const codigo = Math.abs(hash) % 900000 + 100000;
  return String(codigo);
}

function getFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getAllUsers() {
  const extras = getFromStorage(STORAGE_KEYS.usuarios, []);
  return [...MOCK_USERS, ...extras];
}

function findUser(username) {
  return getAllUsers().find((u) => u.username === username);
}

function getVisitas(username) {
  const all = getFromStorage(STORAGE_KEYS.visitas, {});
  return all[username] || [];
}

function setVisitas(username, visitas) {
  const all = getFromStorage(STORAGE_KEYS.visitas, {});
  all[username] = visitas;
  saveToStorage(STORAGE_KEYS.visitas, all);
}

function getSelosDesbloqueados(username) {
  const all = getFromStorage(STORAGE_KEYS.selos, {});
  return all[username] || [];
}

function setSelosDesbloqueados(username, selos) {
  const all = getFromStorage(STORAGE_KEYS.selos, {});
  all[username] = selos;
  saveToStorage(STORAGE_KEYS.selos, all);
}

function getProdutos() {
  return getFromStorage(STORAGE_KEYS.produtos, PRODUTOS_INICIAIS);
}

function saveProdutos(produtos) {
  saveToStorage(STORAGE_KEYS.produtos, produtos);
}

function getTrocas() {
  return getFromStorage(STORAGE_KEYS.trocas, TROCAS_INICIAIS);
}

function saveTrocas(trocas) {
  saveToStorage(STORAGE_KEYS.trocas, trocas);
}

function getLocalById(localId) {
  return LOCAIS.find((l) => l.id === localId);
}

function getSelosByLocal(localId) {
  return SELOS.filter((s) => s.localId === localId);
}

function registrarUsuarioExtra(dados) {
  const extras = getFromStorage(STORAGE_KEYS.usuarios, []);
  extras.push(dados);
  saveToStorage(STORAGE_KEYS.usuarios, extras);
}

function getProgressoUsuario(username) {
  return getFromStorage(`descubradv_progresso_${username}`, null);
}

function saveProgressoUsuario(username, progresso) {
  saveToStorage(`descubradv_progresso_${username}`, progresso);
}

function calcularPontosUsuario(username, basePontos) {
  const progresso = getProgressoUsuario(username);
  return progresso?.pontos ?? basePontos ?? 0;
}

function calcularNivelUsuario(username, selosCount, baseNivel) {
  const progresso = getProgressoUsuario(username);
  if (progresso?.nivel) return progresso.nivel;
  return calcularNivelFromSelos(selosCount, baseNivel);
}

function calcularNivelFromSelos(selosCount, baseNivel) {
  if (baseNivel) return baseNivel;
  return Math.max(1, Math.min(10, selosCount + 1));
}

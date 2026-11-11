/* =========================================================
   Botinas Couro Forte — Catálogo e Pedidos do Representante
   Tudo fica salvo no próprio celular (localStorage).
   ========================================================= */
'use strict';

/* ---- WhatsApp da fábrica (já vem configurado) ---- */
const FABRICA_ZAP = '(34) 3315-0163';

const CHAVE = 'courofort_app_v1';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const moeda = v => (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dataBR = iso => new Date(iso).toLocaleDateString('pt-BR');
const horaBR = iso => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const numero = v => { const n = parseFloat(String(v).replace(/\./g, '').replace(',', '.')); return isNaN(n) ? 0 : n; };
const nPed = n => String(n).padStart(4, '0');
const PROD = Object.fromEntries(CATALOGO.map(p => [p.id, p]));
const chavePreco = p => `${p.nome}|${p.ref}`;

/* ---------------- Ícones ---------------- */
const IC = {
  zap: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.1.1.7-.1 1.3z"/></svg>',
  pix: '<svg viewBox="0 0 24 24"><path d="M12 2.8l9.2 9.2-9.2 9.2L2.8 12z"/><path d="M7.5 12l2.6-2.6h3.8L16.5 12l-2.6 2.6h-3.8z"/></svg>',
  boleto: '<svg viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="M6 8v8M8.5 8v8M10.5 8v8M13.5 8v8M15.5 8v8M18 8v8"/></svg>',
  debito: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/></svg>',
  credito: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19"/><circle cx="15.2" cy="14.6" r="1.7"/><circle cx="17.8" cy="14.6" r="1.7"/></svg>',
  pdf: '<svg viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/><rect x="6" y="14" width="12" height="7" rx="1"/></svg>',
  editar: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
  copiar: '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>',
  lixo: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/></svg>',
  email: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/></svg>',
  cliente: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  caixa: '<svg viewBox="0 0 24 24"><path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/></svg>',
  carteira: '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h12v4"/><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="16.5" cy="13.5" r="1.3"/></svg>',
  soma: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2"/></svg>',
  lupa: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 8v6M8 11h6"/></svg>',
  bota: '<svg viewBox="0 0 24 24"><path d="M7 3h6v8l6 3a2 2 0 0 1 2 2v3H4V3h3"/><path d="M4 19v2h17v-2"/></svg>',
  pasta: '<svg viewBox="0 0 24 24"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.2h8.5A1.5 1.5 0 0 1 21 8.7v9.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/></svg>',
  excel: '<svg viewBox="0 0 24 24"><path d="M14 3H6a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5V8.5z"/><path d="M14 3v5.5h5.5M9 12.5l4 5M13 12.5l-4 5"/></svg>',
  ok: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
};

/* ---------------- Formas de pagamento ---------------- */
const FORMAS = {
  pix: { nome: 'PIX', ic: IC.pix, info: 'Pagamento à vista via PIX.' },
  boleto: { nome: 'Boleto', ic: IC.boleto },
  debito: { nome: 'Débito', ic: IC.debito, info: 'Cartão de débito — pagamento à vista.' },
  credito: { nome: 'Crédito', ic: IC.credito }
};
const PRAZOS_BOLETO = ['À vista', '7 dias', '14 dias', '21 dias', '28 dias', '30 dias', '30/60', '30/60/90', '30/60/90/120', '28/56/84'];
function pagamentoTexto(p) {
  let t = '';
  if (p.formaPag === 'pix') t = 'PIX (à vista)';
  else if (p.formaPag === 'debito') t = 'Cartão de débito (à vista)';
  else if (p.formaPag === 'boleto') t = 'Boleto — ' + (p.prazoBoleto || 'À vista');
  else if (p.formaPag === 'credito') { const n = p.parcelas || 1; t = `Cartão de crédito — ${n === 1 ? 'à vista' : n + 'x'}`; }
  else if (p.pagamento) t = p.pagamento; // pedidos antigos
  if (p.pagObs) t += (t ? ' · ' : '') + p.pagObs;
  return t;
}

/* ---------------- Dados salvos ---------------- */
function novoPedido() {
  return {
    id: 'p' + Date.now(), numero: null, criado: new Date().toISOString(), status: 'aberto',
    cliente: { nome: '', doc: '', cidade: '', uf: '', tel: '', contato: '' },
    formaPag: D?.config?.formaPadrao || '', prazoBoleto: '', parcelas: 1, pagObs: '',
    entrega: '', desconto: 0, obs: '', itens: []
  };
}
const PADRAO = {
  config: { rep: '', repTel: '', fabricaZap: FABRICA_ZAP, fabricaEmail: '', formaPadrao: '', tema: '' },
  precos: {}, seq: 0, atual: null, pedidos: []
};
let D;
function carregar() {
  try { D = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch { D = {}; }
  D = { ...structuredClone(PADRAO), ...D, config: { ...PADRAO.config, ...(D.config || {}) } };
  if (!D.config.fabricaZap) D.config.fabricaZap = FABRICA_ZAP;
  if (!D.atual) D.atual = novoPedido();
}
function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(D)); }
  catch (e) { aviso('Não foi possível salvar no aparelho'); }
  atualizarBadge();
}
carregar();
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

/* ---------------- Tema claro / escuro ---------------- */
function aplicarTema(t) {
  document.documentElement.dataset.tema = t;
  $('#temaClaro').classList.toggle('ativo', t === 'claro');
  $('#temaEscuro').classList.toggle('ativo', t === 'escuro');
  $('meta[name=theme-color]').content = t === 'escuro' ? '#1c0f07' : '#4a2814';
}
$('#temaClaro').onclick = () => { D.config.tema = 'claro'; salvar(); aplicarTema('claro'); };
$('#temaEscuro').onclick = () => { D.config.tema = 'escuro'; salvar(); aplicarTema('escuro'); };
aplicarTema(D.config.tema || document.documentElement.dataset.tema || 'claro');

/* ---------------- Botão voltar ao topo ---------------- */
const btnTopo = $('#paraTopo');
addEventListener('scroll', () => btnTopo.classList.toggle('mostra', scrollY > 500), { passive: true });
btnTopo.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

/* ---------------- Utilidades ---------------- */
let tAviso;
function aviso(msg) {
  const el = $('#aviso'); el.textContent = msg; el.classList.add('mostra');
  clearTimeout(tAviso); tAviso = setTimeout(() => el.classList.remove('mostra'), 2400);
}
const paresItem = it => Object.values(it.grade).reduce((a, b) => a + (b || 0), 0);
const totaisPedido = p => {
  const pares = p.itens.reduce((a, it) => a + paresItem(it), 0);
  const bruto = p.itens.reduce((a, it) => a + paresItem(it) * (it.preco || 0), 0);
  const desc = bruto * (Number(p.desconto) || 0) / 100;
  return { pares, bruto, desc, total: bruto - desc };
};
const gradeLista = g => Object.entries(g).filter(([, q]) => q > 0).sort((a, b) => a[0] - b[0]);
const gradeTexto = g => gradeLista(g).map(([n, q]) => `${n}(${q})`).join('  ');
const gradeChips = g => gradeLista(g).map(([n, q]) => `<span>${n}: <b>${q}</b></span>`).join('');
function atualizarBadge() {
  const n = D.atual.itens.reduce((a, it) => a + paresItem(it), 0);
  const b = $('#badge'); b.hidden = !n;
  if (b.textContent !== String(n)) { b.textContent = n; b.style.animation = 'none'; b.offsetWidth; b.style.animation = ''; }
}
function telZap(t) {
  let n = String(t || '').replace(/\D/g, '');
  if (n && n.length <= 11) n = '55' + n;
  return n;
}
const linkZap = txt => `https://wa.me/${telZap(D.config.fabricaZap || FABRICA_ZAP)}?text=${encodeURIComponent(txt)}`;

/* ---------------- Navegação ---------------- */
const TITULOS = { catalogo: 'Catálogo', pedido: 'Fazer Pedido', historico: 'Histórico', config: 'Ajustes' };
function irPara(tela) {
  $$('.tela').forEach(t => t.classList.toggle('ativa', t.id === 'tela-' + tela));
  $$('.abas button').forEach(b => b.classList.toggle('ativa', b.dataset.tela === tela));
  $('#topoTitulo').textContent = TITULOS[tela];
  ({ catalogo: renderCatalogo, pedido: renderPedido, historico: renderHistorico, config: renderConfig })[tela]();
  scrollTo(0, 0);
}
$$('.abas button').forEach(b => b.onclick = () => irPara(b.dataset.tela));
function renderTopo() { $('#topoRep').textContent = D.config.rep ? 'Rep.: ' + D.config.rep : 'Botinas Couro Forte · Uberaba'; }

/* ---------------- Catálogo ---------------- */
let secaoAtiva = 'Todas';
function renderSecoes() {
  const cont = { Todas: CATALOGO.length };
  CATALOGO.forEach(p => cont[p.secao] = (cont[p.secao] || 0) + 1);
  const ordem = secaoAtiva === 'Todas' ? ['Todas', ...SECOES] : ['Todas', secaoAtiva, ...SECOES.filter(s => s !== secaoAtiva)];
  $('#secoes').innerHTML = ordem.map(s =>
    `<button class="chip ${s === secaoAtiva ? 'ativa' : ''}" data-s="${esc(s)}">${esc(s)}<small>${cont[s] || 0}</small></button>`).join('');
  // No celular mostra só 2 linhas de seções com o botão "Ver todas"
  let ver = $('#verSecoes');
  if (!ver) {
    ver = document.createElement('button'); ver.id = 'verSecoes'; ver.className = 'ver-secoes';
    $('#secoes').after(ver); $('#secoes').classList.add('recolhido');
    ver.onclick = () => { const r = $('#secoes').classList.toggle('recolhido'); pintaVer(); };
  }
  function pintaVer() {
    const r = $('#secoes').classList.contains('recolhido');
    ver.classList.toggle('aberto', !r);
    ver.innerHTML = (r ? `Ver todas as seções (${SECOES.length})` : 'Mostrar menos') + ' <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
  }
  pintaVer();
  $$('#secoes .chip').forEach(c => c.onclick = () => {
    secaoAtiva = c.dataset.s; renderCatalogo();
    $('#secoes').classList.add('recolhido'); pintaVer();
    const alvo = $('#listaCatalogo').getBoundingClientRect().top + scrollY - $('.topo').offsetHeight - 8;
    if (scrollY > alvo) scrollTo({ top: alvo, behavior: 'smooth' });
  });
}
function cardHTML(p, i) {
  const it = D.atual.itens.find(x => x.prodId === p.id);
  const preco = D.precos[chavePreco(p)];
  return `<button class="card ${it ? 'no-pedido' : ''}" data-id="${esc(p.id)}" style="--i:${Math.min(i, 14)}">
    ${it ? `<span class="selo">${paresItem(it)} pares</span>` : ''}
    <div class="foto"><img loading="lazy" src="${esc(p.img)}" alt="${esc(p.nome)} ${esc(p.ref)}"></div>
    <div class="info"><div class="nome">${esc(p.nome)}</div><div class="ref">Ref. ${esc(p.ref)}</div>
      <div class="desc">${esc(p.couro)} · Bico ${esc(p.bico)}<br>Nº ${p.num[0]} ao ${p.num[1]}</div>
      ${preco ? `<div class="preco">${moeda(preco)}</div>` : ''}</div></button>`;
}
function renderCatalogo() {
  renderSecoes();
  const q = $('#busca').value.trim().toLowerCase();
  let lista = CATALOGO.filter(p => secaoAtiva === 'Todas' || p.secao === secaoAtiva);
  if (q) lista = lista.filter(p => [p.nome, p.ref, p.couro, p.solado, p.bico, p.secao].join(' ').toLowerCase().includes(q));
  const el = $('#listaCatalogo');
  if (!lista.length) { el.innerHTML = `<div class="vazio">${IC.lupa}<br>Nenhum modelo encontrado.</div>`; return; }
  let i = 0;
  el.innerHTML = SECOES.filter(s => lista.some(p => p.secao === s)).map(s => {
    const ps = lista.filter(p => p.secao === s);
    return `<h2 class="titulo-secao">${esc(s)} <small>${ps.length} modelo${ps.length > 1 ? 's' : ''}</small></h2>
      <div class="grade">${ps.map(p => cardHTML(p, i++)).join('')}</div>`;
  }).join('');
  $$('.card', el).forEach(c => c.onclick = () => abrirProduto(c.dataset.id));
}
$('#busca').addEventListener('input', renderCatalogo);

/* ---------------- Folha (painel que sobe) ---------------- */
function abrirFolha(html) { $('#folhaCorpo').innerHTML = '<div class="alca"></div>' + html; $('#folha').hidden = false; $('#folhaCorpo').scrollTop = 0; document.body.style.overflow = 'hidden'; }
function fecharFolha() { $('#folha').hidden = true; document.body.style.overflow = ''; }
$('#folha').addEventListener('click', e => { if (e.target.closest('[data-fechar]')) fecharFolha(); });

function abrirProduto(id) {
  const p = PROD[id]; if (!p) return;
  const existente = D.atual.itens.find(i => i.prodId === id);
  const grade = existente ? { ...existente.grade } : {};
  let preco = existente ? existente.preco : (D.precos[chavePreco(p)] || 0);
  const nums = []; for (let n = p.num[0]; n <= p.num[1]; n++) nums.push(n);

  abrirFolha(`
    <div class="folha-foto" id="fotoGrande"><span class="lupa">${IC.lupa}</span><img src="${esc(p.img)}" alt=""></div>
    <h2>${esc(p.nome)} — Ref. ${esc(p.ref)}</h2>
    <div class="specs">
      <div><b>Couro / Cor</b>${esc(p.couro)}</div><div><b>Solado</b>${esc(p.solado)}</div>
      <div><b>Bico</b>${esc(p.bico)}</div><div><b>Numeração</b>${p.num[0]} ao ${p.num[1]}</div>
    </div>
    <div class="rotulo">Quantidade por número
      <span><button id="mais1">+1 em todos</button> <button id="limpar">Zerar</button></span></div>
    <div class="numeros">${nums.map(n => `
      <div class="num" data-n="${n}"><div class="n">${n}</div>
        <div class="ctrl"><button data-d="-1" aria-label="menos">−</button>
        <input inputmode="numeric" value="${grade[n] || 0}"><button data-d="1" aria-label="mais">+</button></div></div>`).join('')}
    </div>
    <label class="campo" style="margin-top:16px"><span>Valor do par (R$)</span>
      <input id="precoPar" inputmode="decimal" placeholder="0,00" value="${preco ? String(preco).replace('.', ',') : ''}"></label>
    <div class="resumo-item"><span id="resPares">0 pares</span><b id="resTotal">R$ 0,00</b></div>
    <div class="btns">
      <button class="btn" id="addItem">${IC.ok} ${existente ? 'Atualizar no pedido' : 'Adicionar ao pedido'}</button>
      ${existente ? `<button class="btn perigo" id="remItem">${IC.lixo} Remover do pedido</button>` : ''}
      <button class="btn sec" data-fechar>Voltar ao catálogo</button>
    </div>`);

  const atualiza = () => {
    $$('.num').forEach(d => { const n = d.dataset.n; $('input', d).value = grade[n] || 0; d.classList.toggle('tem', (grade[n] || 0) > 0); });
    const pares = Object.values(grade).reduce((a, b) => a + b, 0);
    $('#resPares').textContent = `${pares} par${pares === 1 ? '' : 'es'}`;
    $('#resTotal').textContent = moeda(pares * preco);
  };
  $$('.num').forEach(d => {
    const n = d.dataset.n;
    $$('button', d).forEach(b => b.onclick = () => { grade[n] = Math.max(0, (grade[n] || 0) + Number(b.dataset.d)); atualiza(); });
    $('input', d).oninput = e => { grade[n] = Math.max(0, parseInt(e.target.value) || 0); atualiza(); };
    $('input', d).onfocus = e => e.target.select();
  });
  $('#mais1').onclick = () => { nums.forEach(n => grade[n] = (grade[n] || 0) + 1); atualiza(); };
  $('#limpar').onclick = () => { nums.forEach(n => grade[n] = 0); atualiza(); };
  $('#precoPar').oninput = e => { preco = numero(e.target.value); atualiza(); };
  $('#fotoGrande').onclick = () => { $('#zoomImg').src = p.img; $('#zoom').hidden = false; };
  $('#addItem').onclick = () => {
    Object.keys(grade).forEach(n => { if (!grade[n]) delete grade[n]; });
    if (!Object.keys(grade).length) return aviso('Informe a quantidade em pelo menos um número');
    if (!preco) return aviso('Informe o valor do par');
    D.precos[chavePreco(p)] = preco;
    const item = { prodId: p.id, nome: p.nome, ref: p.ref, couro: p.couro, solado: p.solado, bico: p.bico, img: p.img, grade, preco };
    const i = D.atual.itens.findIndex(x => x.prodId === p.id);
    if (i >= 0) D.atual.itens[i] = item; else D.atual.itens.push(item);
    salvar(); fecharFolha(); aviso(existente ? 'Item atualizado ✔' : 'Adicionado ao pedido ✔');
    refrescarTelaAtual();
  };
  if (existente) $('#remItem').onclick = () => removerItem(p.id);
  atualiza();
}
async function removerItem(id) {
  if (!await confirmar('Remover este modelo do pedido?', 'Remover')) return;
  D.atual.itens = D.atual.itens.filter(i => i.prodId !== id);
  salvar(); fecharFolha(); refrescarTelaAtual(); aviso('Item removido');
}
function refrescarTelaAtual() {
  const t = $('.abas button.ativa').dataset.tela;
  if (t === 'catalogo') renderCatalogo(); else if (t === 'pedido') renderPedido();
}
$('#zoom').onclick = () => { $('#zoom').hidden = true; };

/* ---------------- Pedido atual ---------------- */
function clientesConhecidos() {
  const m = new Map();
  D.pedidos.forEach(p => { if (p.cliente.nome) m.set(p.cliente.nome.trim().toLowerCase(), p.cliente); });
  return [...m.values()];
}
function htmlPagamento(p) {
  const f = p.formaPag;
  let extra = '';
  if (f === 'boleto') extra = `<label class="campo"><span>Prazo do boleto</span><select data-p="prazoBoleto">
      ${PRAZOS_BOLETO.map(x => `<option ${x === (p.prazoBoleto || 'À vista') ? 'selected' : ''}>${x}</option>`).join('')}</select></label>`;
  else if (f === 'credito') extra = `<label class="campo"><span>Parcelas no cartão</span><select data-p="parcelas">
      ${Array.from({ length: 12 }, (_, i) => i + 1).map(n => `<option value="${n}" ${n === (p.parcelas || 1) ? 'selected' : ''}>${n === 1 ? 'À vista (1x)' : n + 'x'}</option>`).join('')}</select></label>`;
  else if (f) extra = `<div class="pag-info">${FORMAS[f].info}</div>`;
  return `<div class="pags">${Object.entries(FORMAS).map(([k, v]) =>
      `<button class="pag ${f === k ? 'ativa' : ''}" data-forma="${k}">${v.ic}${v.nome}</button>`).join('')}</div>${extra}`;
}
function renderPedido() {
  const p = D.atual, c = p.cliente;
  const clientes = clientesConhecidos();
  $('#pedidoConteudo').innerHTML = `
    <div class="num-pedido"><span>${p.numero ? 'Pedido nº ' + nPed(p.numero) + ' (editando)' : 'Novo pedido'}</span><span>${dataBR(p.criado)}</span></div>
    <div class="bloco"><h3><span class="h-ic">${IC.cliente} Cliente</span></h3>
      <label class="campo"><span>Cliente (loja que está comprando) *</span><input data-c="nome" list="listaClientes" value="${esc(c.nome)}" autocomplete="off"></label>
      <datalist id="listaClientes">${clientes.map(x => `<option value="${esc(x.nome)}">`).join('')}</datalist>
      <div class="linha2">
        <label class="campo"><span>CNPJ / CPF</span><input data-c="doc" inputmode="numeric" value="${esc(c.doc)}"></label>
        <label class="campo"><span>Telefone</span><input data-c="tel" inputmode="tel" value="${esc(c.tel)}"></label>
      </div>
      <div class="linha-local">
        <label class="campo"><span>Estado</span><select id="ufSel"><option value="">Escolha o estado</option>
          ${Object.entries(UFS).map(([k, v]) => `<option value="${k}" ${c.uf === k ? 'selected' : ''}>${v} (${k})</option>`).join('')}</select></label>
        <div class="campo cidade-box"><span>Cidade</span>
          <input id="cidadeBusca" value="${esc(c.cidade)}" placeholder="Toque e escolha a cidade…" autocomplete="off">
          <div class="sugestoes" id="sugCidades" hidden></div></div>
      </div>
      <label class="campo" style="margin:0"><span>Pessoa que atendeu na loja (opcional)</span><input data-c="contato" value="${esc(c.contato)}"></label>
    </div>

    <div class="bloco"><h3><span class="h-ic">${IC.caixa} Itens</span><small>${p.itens.length} modelo${p.itens.length === 1 ? '' : 's'}</small></h3>
      ${p.itens.length ? p.itens.map(it => `
        <div class="item">
          <img src="${esc(it.img)}" alt="">
          <div><div class="t">${esc(it.nome)} — Ref. ${esc(it.ref)}</div>
            <div class="d">${esc(it.couro)} · ${esc(it.solado)} · Bico ${esc(it.bico)}</div>
            <div class="g">${gradeChips(it.grade)}</div></div>
          <div class="v">${paresItem(it)} × ${moeda(it.preco)}<b>${moeda(paresItem(it) * it.preco)}</b>
            <div class="acoes"><button data-ed="${esc(it.prodId)}">Editar</button><button data-rm="${esc(it.prodId)}" aria-label="Remover">✕</button></div></div>
        </div>`).join('') : `<div class="vazio" style="padding:20px">${IC.bota}<br>Nenhum item ainda.<br>Escolha os modelos no catálogo.</div>`}
      <button class="btn sec" id="irCatalogo" style="margin-top:12px">+ Adicionar modelos</button>
    </div>

    <div class="bloco"><h3><span class="h-ic">${IC.carteira} Forma de pagamento</span></h3>
      <div id="pagBox">${htmlPagamento(p)}</div>
      <div class="linha2">
        <label class="campo"><span>Desconto (%)</span><input data-p="desconto" inputmode="decimal" value="${p.desconto || ''}" placeholder="0"></label>
        <label class="campo"><span>Previsão de entrega</span><input data-p="entrega" placeholder="Ex.: 20 dias" value="${esc(p.entrega)}"></label>
      </div>
      <label class="campo"><span>Observações</span><textarea data-p="obs">${esc(p.obs)}</textarea></label>
    </div>

    <div class="bloco totais"><h3><span class="h-ic">${IC.soma} Resumo</span></h3><div id="totais"></div></div>

    <div class="bloco">
      <div class="btns" style="margin:0">
        <a class="btn zap" id="envZap" href="#" target="_blank" rel="noopener">${IC.zap} Enviar para a Couro Forte</a>
        <div class="btns dois" style="margin:0">
          <button class="btn sec" id="envPdf">${IC.pdf} PDF</button>
          <button class="btn sec" id="salvarPed">${IC.ok} Salvar</button>
        </div>
        <button class="btn perigo" id="descartar">${IC.lixo} Descartar pedido</button>
      </div>
    </div>`;

  const pintaTotais = () => {
    const t = totaisPedido(D.atual);
    $('#totais').innerHTML = `<div><span>Total de pares</span><b>${t.pares}</b></div>
      <div><span>Subtotal</span><span>${moeda(t.bruto)}</span></div>
      ${t.desc ? `<div><span>Desconto (${D.atual.desconto}%)</span><span>− ${moeda(t.desc)}</span></div>` : ''}
      ${pagamentoTexto(D.atual) ? `<div><span>Pagamento</span><span>${esc(pagamentoTexto(D.atual))}</span></div>` : ''}
      <div class="final"><span>Total</span><span>${moeda(t.total)}</span></div>`;
  };
  pintaTotais();

  const ligaPagamento = () => {
    $$('#pagBox .pag').forEach(b => b.onclick = () => {
      D.atual.formaPag = b.dataset.forma; salvar();
      $('#pagBox').innerHTML = htmlPagamento(D.atual); ligaPagamento(); pintaTotais();
    });
    $$('#pagBox [data-p]').forEach(s => s.onchange = () => {
      D.atual[s.dataset.p] = s.dataset.p === 'parcelas' ? Number(s.value) : s.value; salvar(); pintaTotais();
    });
  };
  ligaPagamento();

  ligaCidade();
  $$('[data-c]').forEach(inp => inp.oninput = () => {
    D.atual.cliente[inp.dataset.c] = inp.dataset.c === 'uf' ? inp.value.toUpperCase() : inp.value;
    if (inp.dataset.c === 'nome') {
      const ach = clientes.find(x => x.nome === inp.value);
      if (ach) { D.atual.cliente = { ...ach }; salvar(); return renderPedido(); }
    }
    salvar();
  });
  $$('.bloco > .linha2 [data-p], .bloco > label [data-p]').forEach(inp => inp.oninput = () => {
    D.atual[inp.dataset.p] = inp.dataset.p === 'desconto' ? Math.min(100, numero(inp.value)) : inp.value;
    salvar(); if (inp.dataset.p === 'desconto') pintaTotais();
  });
  $$('[data-ed]').forEach(b => b.onclick = () => abrirProduto(b.dataset.ed));
  $$('[data-rm]').forEach(b => b.onclick = () => removerItem(b.dataset.rm));
  $('#irCatalogo').onclick = () => irPara('catalogo');

  // Enviar: o link abre direto a conversa da Couro Forte no WhatsApp com o pedido escrito
  $('#envZap').onclick = e => {
    if (!validar()) { e.preventDefault(); return; }
    const ped = arquivar('enviado');
    e.currentTarget.href = linkZap(textoPedido(ped));
    setTimeout(() => posEnvio(ped), 50);
  };
  $('#envPdf').onclick = () => { if (validar()) imprimir(D.atual); };
  $('#salvarPed').onclick = () => { if (!validar()) return; arquivar('salvo'); aviso('Pedido salvo ✔'); irPara('historico'); };
  $('#descartar').onclick = async () => {
    if (!await confirmar('Descartar este pedido? Os itens serão apagados.', 'Descartar')) return;
    D.atual = novoPedido(); salvar(); renderPedido();
  };
}

/* ---------------- Escolha rápida de cidade e estado ---------------- */
const semAcento = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const TODAS_CIDADES = Object.entries(CIDADES).flatMap(([uf, l]) => l.map(n => ({ n, uf, k: semAcento(n) })));
function cidadesRecentes() {
  const m = new Map();
  D.pedidos.forEach(p => { if (p.cliente.cidade && p.cliente.uf) m.set(p.cliente.cidade + '|' + p.cliente.uf, { n: p.cliente.cidade, uf: p.cliente.uf }); });
  return [...m.values()].slice(0, 6);
}
function ligaCidade() {
  const inp = $('#cidadeBusca'), box = $('#sugCidades'), sel = $('#ufSel');
  let lista = [], foco = -1, escolhida = D.atual.cliente.cidade;
  const escolher = (n, uf) => {
    escolhida = n;
    D.atual.cliente.cidade = n; D.atual.cliente.uf = uf; salvar();
    inp.value = n; sel.value = uf; box.hidden = true;
  };
  const mostrar = () => {
    const q = semAcento(inp.value.trim()), uf = sel.value;
    let html = '';
    if (!q || (escolhida && inp.value === escolhida)) {
      const rec = cidadesRecentes().filter(c => !uf || c.uf === uf);
      if (rec.length) html += '<div class="grupo">Usadas recentemente</div>' + rec.map(c => btn(c)).join('');
      const base = uf ? CIDADES[uf].map(n => ({ n, uf })) : [];
      if (base.length) html += `<div class="grupo">${UFS[uf]} — ${base.length} cidades</div>` + base.map(btn).join('');
      if (!uf && !rec.length) html += '<div class="nada">Escolha o estado ao lado, ou digite o nome da cidade.</div>';
    } else {
      const achou = TODAS_CIDADES.filter(c => (!uf || c.uf === uf) && c.k.includes(q))
        .sort((a, b) => (b.k.startsWith(q) - a.k.startsWith(q)) || a.k.localeCompare(b.k)).slice(0, 60);
      html = achou.length ? achou.map(btn).join('') : '<div class="nada">Nenhuma cidade encontrada.</div>';
    }
    box.innerHTML = html; box.hidden = false; foco = -1;
    lista = $$('button', box);
    lista.forEach(b => b.onmousedown = e => { e.preventDefault(); escolher(b.dataset.n, b.dataset.uf); });
  };
  const btn = c => `<button type="button" data-n="${esc(c.n)}" data-uf="${c.uf}">${esc(c.n)}<small>${c.uf}</small></button>`;
  inp.onfocus = () => { inp.select(); mostrar(); };
  inp.onclick = mostrar;
  inp.oninput = () => { D.atual.cliente.cidade = inp.value; salvar(); mostrar(); };
  inp.onblur = () => setTimeout(() => { box.hidden = true; }, 120);
  inp.onkeydown = e => {
    if (box.hidden || !lista.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); foco = Math.max(0, Math.min(lista.length - 1, foco + (e.key === 'ArrowDown' ? 1 : -1)));
      lista.forEach((b, i) => b.classList.toggle('foco', i === foco)); lista[foco].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') { e.preventDefault(); const b = lista[Math.max(foco, 0)]; escolher(b.dataset.n, b.dataset.uf); }
  };
  sel.onchange = () => {
    D.atual.cliente.uf = sel.value;
    if (D.atual.cliente.cidade && sel.value && !CIDADES[sel.value].includes(D.atual.cliente.cidade)) { D.atual.cliente.cidade = ''; inp.value = ''; }
    salvar(); inp.focus();
  };
}

/* ---------------- Exportar para Excel ---------------- */
function exportarExcel(pedidos, nomeArquivo) {
  if (!window.XLSX) return aviso('Excel indisponível — abra o app com internet uma vez');
  if (!pedidos.length) return aviso('Nenhum pedido para exportar');
  const R$ = 'R$ #,##0.00';
  // Aba 1: um pedido por linha
  const linhasP = [['Nº Pedido', 'Data', 'Status', 'Cliente', 'CNPJ/CPF', 'Telefone', 'Cidade', 'UF', 'Atendido por',
    'Pagamento', 'Entrega', 'Modelos', 'Pares', 'Subtotal', 'Desconto %', 'Desconto R$', 'Total', 'Observações']];
  pedidos.forEach(p => {
    const t = totaisPedido(p), c = p.cliente;
    linhasP.push([nPed(p.numero), new Date(p.atualizado || p.criado), p.status === 'enviado' ? 'Enviado' : 'Salvo', c.nome, c.doc, c.tel,
      c.cidade, c.uf, c.contato, pagamentoTexto(p), p.entrega, p.itens.length, t.pares, t.bruto, Number(p.desconto) || 0, t.desc, t.total, p.obs]);
  });
  const t = pedidos.reduce((a, p) => { const x = totaisPedido(p); a.pares += x.pares; a.total += x.total; return a; }, { pares: 0, total: 0 });
  linhasP.push([], ['TOTAL GERAL', '', '', '', '', '', '', '', '', '', '', '', t.pares, '', '', '', t.total]);
  // Aba 2: um modelo por linha, com a grade em colunas por número
  const nums = [...new Set(pedidos.flatMap(p => p.itens.flatMap(it => Object.keys(it.grade).map(Number))))].sort((a, b) => a - b);
  const linhasI = [['Nº Pedido', 'Data', 'Cliente', 'Cidade', 'UF', 'Modelo', 'Ref.', 'Couro / Cor', 'Solado', 'Bico',
    ...nums.map(n => 'Nº ' + n), 'Pares', 'Valor par', 'Total']];
  pedidos.forEach(p => p.itens.forEach(it => {
    const pr = paresItem(it);
    linhasI.push([nPed(p.numero), new Date(p.atualizado || p.criado), p.cliente.nome, p.cliente.cidade, p.cliente.uf,
      it.nome, it.ref, it.couro, it.solado, it.bico, ...nums.map(n => it.grade[n] || ''), pr, it.preco, pr * it.preco]);
  }));
  const wb = XLSX.utils.book_new();
  const fmt = (ws, colsMoeda, colData, larg) => {
    const r = XLSX.utils.decode_range(ws['!ref']);
    for (let R = 1; R <= r.e.r; R++) {
      colsMoeda.forEach(C => { const cel = ws[XLSX.utils.encode_cell({ r: R, c: C })]; if (cel && cel.t === 'n') cel.z = R$; });
      const d = ws[XLSX.utils.encode_cell({ r: R, c: colData })]; if (d && d.t === 'd') d.z = 'dd/mm/yyyy hh:mm';
    }
    ws['!cols'] = larg.map(w => ({ wch: w }));
    ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: 0, c: r.e.c } }) };
  };
  const ws1 = XLSX.utils.aoa_to_sheet(linhasP, { cellDates: true });
  fmt(ws1, [13, 15, 16], 1, [10, 16, 9, 30, 18, 15, 18, 5, 16, 26, 14, 9, 8, 13, 11, 13, 14, 30]);
  const ws2 = XLSX.utils.aoa_to_sheet(linhasI, { cellDates: true });
  const base = 10 + nums.length;
  fmt(ws2, [base + 1, base + 2], 1, [10, 16, 28, 18, 5, 20, 7, 24, 12, 10, ...nums.map(() => 6), 8, 12, 14]);
  XLSX.utils.book_append_sheet(wb, ws1, 'Pedidos');
  XLSX.utils.book_append_sheet(wb, ws2, 'Itens e Grade');
  try { XLSX.writeFile(wb, nomeArquivo || `pedidos-couro-forte-${new Date().toLocaleDateString('sv')}.xlsx`); aviso('Planilha Excel gerada ✔'); }
  catch (e) { aviso('Não foi possível baixar o arquivo neste navegador'); }
}
const nomeXls = p => `pedido-${nPed(p.numero)}-${semAcento(p.cliente.nome).replace(/[^a-z0-9]+/g, '-').slice(0, 30)}.xlsx`;

function validar() {
  const p = D.atual;
  if (!p.itens.length) { aviso('Adicione pelo menos um modelo'); return false; }
  if (!p.cliente.nome.trim()) { aviso('Informe o nome do cliente'); $('[data-c="nome"]')?.focus(); return false; }
  if (!p.formaPag) { aviso('Escolha a forma de pagamento'); $('#pagBox')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
  return true;
}
function arquivar(status) {
  const p = D.atual;
  if (!p.numero) { D.seq += 1; p.numero = D.seq; }
  p.status = status === 'enviado' || p.status === 'enviado' ? 'enviado' : 'salvo';
  if (status === 'enviado') p.enviado = new Date().toISOString();
  p.atualizado = new Date().toISOString();
  const i = D.pedidos.findIndex(x => x.id === p.id);
  if (i >= 0) D.pedidos[i] = structuredClone(p); else D.pedidos.unshift(structuredClone(p));
  D.atual = novoPedido(); salvar();
  return D.pedidos.find(x => x.id === p.id);
}

/* ---------------- Texto do pedido (WhatsApp / e-mail) ---------------- */
function textoPedido(p) {
  const t = totaisPedido(p), c = p.cliente, L = [], LIN = '━━━━━━━━━━━━━━━';
  L.push('*BOTINAS COURO FORTE*', `*Pedido nº ${nPed(p.numero)}* — ${dataBR(p.atualizado || p.criado)}`);
  if (D.config.rep) L.push(`Representante: ${D.config.rep}${D.config.repTel ? ' · ' + D.config.repTel : ''}`);
  L.push(LIN, '*CLIENTE*', c.nome);
  if (c.doc) L.push(`CNPJ/CPF: ${c.doc}`);
  if (c.cidade || c.uf) L.push(`Cidade: ${c.cidade}${c.uf ? '/' + c.uf : ''}`);
  if (c.tel) L.push(`Telefone: ${c.tel}`);
  if (c.contato) L.push(`Atendido por: ${c.contato}`);
  L.push(LIN, '*ITENS*');
  p.itens.forEach((it, i) => {
    const pr = paresItem(it);
    L.push('', `*${i + 1}. ${it.nome} — Ref. ${it.ref}*`, `Couro ${it.couro} | Solado ${it.solado} | Bico ${it.bico}`,
      `Grade: ${gradeTexto(it.grade)}`, `${pr} pares × ${moeda(it.preco)} = *${moeda(pr * it.preco)}*`);
  });
  L.push(LIN, `Total de pares: *${t.pares}*`, `Subtotal: ${moeda(t.bruto)}`);
  if (t.desc) L.push(`Desconto (${p.desconto}%): − ${moeda(t.desc)}`);
  L.push(`*TOTAL: ${moeda(t.total)}*`, LIN);
  const pg = pagamentoTexto(p);
  if (pg) L.push(`*Pagamento:* ${pg}`);
  if (p.entrega) L.push(`*Entrega:* ${p.entrega}`);
  if (p.obs) L.push(`*Obs.:* ${p.obs}`);
  return L.join('\n');
}

/* Painel exibido depois que o pedido foi para o WhatsApp */
function posEnvio(p) {
  const t = totaisPedido(p), txt = textoPedido(p);
  const email = (D.config.fabricaEmail || '').trim();
  irPara('historico');
  $('#aviso').classList.remove('mostra');
  abrirFolha(`
    <div style="text-align:center;padding:6px 0 2px">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--zap);color:#fff;display:inline-flex;align-items:center;justify-content:center;animation:aparece .5s">
        <svg viewBox="0 0 24 24" style="width:34px;height:34px;stroke-width:2.6"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
      <h2 style="margin-top:10px">Pedido nº ${nPed(p.numero)} enviado</h2>
      <p style="margin:4px 0 12px;color:var(--suave)">${esc(p.cliente.nome)} · ${t.pares} pares · <b style="color:var(--texto)">${moeda(t.total)}</b><br>
      Conversa aberta com a Couro Forte ${esc(D.config.fabricaZap)}. É só tocar em enviar no WhatsApp.</p>
    </div>
    <div class="btns">
      <a class="btn zap" target="_blank" rel="noopener" href="${linkZap(txt)}">${IC.zap} Abrir o WhatsApp de novo</a>
      <div class="btns dois" style="margin:0">
        <button class="btn sec" id="copiarTxt">${IC.copiar} Copiar texto</button>
        <button class="btn sec" id="pdfPed">${IC.pdf} PDF</button>
      </div>
      <button class="btn excel" id="xlsPed">${IC.excel} Baixar em Excel</button>
      ${email ? `<a class="btn sec" href="mailto:${esc(email)}?subject=${encodeURIComponent('Pedido nº ' + nPed(p.numero) + ' — ' + p.cliente.nome)}&body=${encodeURIComponent(txt.replace(/\*/g, ''))}">${IC.email} Enviar também por e-mail</a>` : ''}
      <button class="btn" data-fechar>Concluir</button>
    </div>`);
  $('#copiarTxt').onclick = () => navigator.clipboard.writeText(txt).then(() => aviso('Texto copiado ✔'), () => aviso('Não foi possível copiar'));
  $('#pdfPed').onclick = () => imprimir(p);
  $('#xlsPed').onclick = () => exportarExcel([p], nomeXls(p));
}

/* Caixa de confirmação própria */
function confirmar(msg, ok = 'Confirmar') {
  return new Promise(res => {
    const el = $('#dialogo');
    el.innerHTML = `<div class="dialogo-caixa"><p>${esc(msg)}</p><div class="btns dois">
      <button class="btn sec" data-r="0">Cancelar</button><button class="btn" data-r="1">${esc(ok)}</button></div></div>`;
    el.hidden = false;
    $$('button', el).forEach(b => b.onclick = () => { el.hidden = true; res(b.dataset.r === '1'); });
  });
}

/* ---------------- PDF / Impressão ---------------- */
function imprimir(p) {
  const t = totaisPedido(p), c = p.cliente;
  $('#impressao').innerHTML = `
    <div class="cab"><img src="img/logo-escura.png" alt="Couro Forte">
      <div style="text-align:right"><h1>Pedido ${p.numero ? 'nº ' + nPed(p.numero) : '(rascunho)'}</h1>
      ${dataBR(p.atualizado || p.criado)}${D.config.rep ? '<br>Representante: ' + esc(D.config.rep) : ''}</div></div>
    <div class="dados"><div><b>Cliente:</b> ${esc(c.nome)}</div><div><b>CNPJ/CPF:</b> ${esc(c.doc)}</div>
      <div><b>Cidade:</b> ${esc(c.cidade)}${c.uf ? '/' + esc(c.uf) : ''}</div><div><b>Telefone:</b> ${esc(c.tel)}</div>
      <div><b>Atendido por:</b> ${esc(c.contato)}</div><div><b>Pagamento:</b> ${esc(pagamentoTexto(p))}</div>
      <div><b>Entrega:</b> ${esc(p.entrega)}</div></div>
    <table><thead><tr><th></th><th>Modelo</th><th>Grade nº(qtd)</th><th class="r">Pares</th><th class="r">Valor par</th><th class="r">Total</th></tr></thead>
    <tbody>${p.itens.map(it => `<tr><td><img class="mini" src="${esc(it.img)}"></td>
      <td><b>${esc(it.nome)} — Ref. ${esc(it.ref)}</b><br>${esc(it.couro)} · ${esc(it.solado)} · Bico ${esc(it.bico)}</td>
      <td>${esc(gradeTexto(it.grade))}</td><td class="r">${paresItem(it)}</td><td class="r">${moeda(it.preco)}</td>
      <td class="r">${moeda(paresItem(it) * it.preco)}</td></tr>`).join('')}</tbody></table>
    <div class="tot">Total de pares: <b>${t.pares}</b><br>Subtotal: ${moeda(t.bruto)}
      ${t.desc ? `<br>Desconto (${p.desconto}%): − ${moeda(t.desc)}` : ''}<br><b>TOTAL: ${moeda(t.total)}</b></div>
    ${p.obs ? `<p><b>Observações:</b> ${esc(p.obs)}</p>` : ''}
    <p style="margin-top:40px">______________________________<br>Assinatura do cliente</p>`;
  setTimeout(() => { try { window.print(); } catch { aviso('Impressão indisponível neste navegador'); } }, 300);
}

/* ---------------- Histórico ---------------- */
function renderHistorico() {
  const q = $('#buscaHist').value.trim().toLowerCase();
  const lista = D.pedidos.filter(p => !q || p.cliente.nome.toLowerCase().includes(q) || String(p.numero).includes(q) || (p.cliente.cidade || '').toLowerCase().includes(q));
  const el = $('#listaHistorico');
  if (!D.pedidos.length) { el.innerHTML = `<div class="vazio">${IC.pasta}<br>Nenhum pedido salvo ainda.</div>`; return; }
  const soma = D.pedidos.reduce((a, p) => { const t = totaisPedido(p); a.pares += t.pares; a.total += t.total; return a; }, { pares: 0, total: 0 });
  el.innerHTML = `<div class="barra-hist"><button class="btn excel" id="xlsTodos">${IC.excel} Exportar ${lista.length === D.pedidos.length ? 'todos' : lista.length} para Excel</button></div>
    <div class="resumo-hist"><div><small>Pedidos</small><b>${D.pedidos.length}</b></div>
      <div><small>Pares</small><b>${soma.pares}</b></div><div><small>Total</small><b>${moeda(soma.total)}</b></div></div>` +
    lista.map(p => {
      const t = totaisPedido(p);
      return `<div class="ped"><div class="l1"><span class="cli">#${nPed(p.numero)} · ${esc(p.cliente.nome)}</span>
        <span class="status ${p.status}">${p.status === 'enviado' ? 'Enviado' : 'Salvo'}</span></div>
        <div class="meta">${horaBR(p.atualizado || p.criado)}${p.cliente.cidade ? ' · ' + esc(p.cliente.cidade) + (p.cliente.uf ? '/' + esc(p.cliente.uf) : '') : ''}</div>
        <div class="meta">${p.itens.length} modelo(s) · ${t.pares} pares · <b style="color:var(--texto)">${moeda(t.total)}</b>${pagamentoTexto(p) ? ' · ' + esc(pagamentoTexto(p)) : ''}</div>
        <div class="acoes">
          <a class="zapi" href="${linkZap(textoPedido(p))}" target="_blank" rel="noopener" data-a="zap" data-id="${p.id}">${IC.zap}Enviar</a>
          <button data-a="pdf" data-id="${p.id}">${IC.pdf}PDF</button>
          <button class="xls" data-a="xls" data-id="${p.id}">${IC.excel}Excel</button>
          <button data-a="abrir" data-id="${p.id}">${IC.editar}Editar</button>
          <button data-a="dup" data-id="${p.id}">${IC.copiar}Copiar</button>
          <button class="del" data-a="del" data-id="${p.id}">${IC.lixo}Excluir</button></div></div>`;
    }).join('');
  $$('.ped [data-a]', el).forEach(b => b.onclick = () => acaoHist(b.dataset.a, b.dataset.id));
  $('#xlsTodos').onclick = () => exportarExcel(lista);
}
$('#buscaHist').addEventListener('input', renderHistorico);

async function acaoHist(a, id) {
  const p = D.pedidos.find(x => x.id === id); if (!p) return;
  if (a === 'zap') { p.status = 'enviado'; p.enviado = new Date().toISOString(); salvar(); setTimeout(renderHistorico, 100); return; }
  if (a === 'pdf') return imprimir(p);
  if (a === 'xls') return exportarExcel([p], nomeXls(p));
  if (a === 'abrir' || a === 'dup') {
    if (D.atual.itens.length && !await confirmar('Já existe um pedido em andamento. Substituir por este? (o atual será descartado)', 'Substituir')) return;
    if (a === 'abrir') D.atual = structuredClone(p);
    else D.atual = { ...structuredClone(p), id: 'p' + Date.now(), numero: null, status: 'aberto', criado: new Date().toISOString(), enviado: null, atualizado: null };
    salvar(); irPara('pedido'); aviso(a === 'abrir' ? 'Pedido aberto para edição' : 'Cópia criada — ajuste e envie');
  }
  if (a === 'del') {
    if (!await confirmar(`Excluir o pedido #${nPed(p.numero)} de ${p.cliente.nome}?`, 'Excluir')) return;
    D.pedidos = D.pedidos.filter(x => x.id !== id); salvar(); renderHistorico();
  }
}

/* ---------------- Ajustes ---------------- */
function renderConfig() {
  const c = D.config;
  const modelos = [...new Map(CATALOGO.map(p => [chavePreco(p), p])).values()]
    .sort((a, b) => SECOES.indexOf(a.secao) - SECOES.indexOf(b.secao) || a.nome.localeCompare(b.nome) || a.ref.localeCompare(b.ref));
  $('#configConteudo').innerHTML = `
    <div class="bloco"><h3><span class="h-ic">${IC.cliente} Representante</span></h3>
      <label class="campo"><span>Seu nome</span><input data-k="rep" value="${esc(c.rep)}"></label>
      <label class="campo"><span>Seu telefone</span><input data-k="repTel" inputmode="tel" value="${esc(c.repTel)}"></label>
      <label class="campo" style="margin:0"><span>Forma de pagamento padrão</span><select data-k="formaPadrao">
        <option value="">Escolher em cada pedido</option>
        ${Object.entries(FORMAS).map(([k, v]) => `<option value="${k}" ${c.formaPadrao === k ? 'selected' : ''}>${v.nome}</option>`).join('')}</select></label>
    </div>
    <div class="bloco"><h3><span class="h-ic">${IC.zap.replace('<svg', '<svg style="fill:var(--zap);stroke:none"')} Fábrica Couro Forte</span></h3>
      <div class="fab-fixo">${IC.zap}<div><small>WhatsApp que recebe os pedidos</small><b>${esc(c.fabricaZap)}</b></div></div>
      <label class="campo"><span>Alterar WhatsApp da fábrica (com DDD)</span><input data-k="fabricaZap" inputmode="tel" value="${esc(c.fabricaZap)}"></label>
      <label class="campo" style="margin:0"><span>E-mail da fábrica (opcional)</span><input data-k="fabricaEmail" type="email" placeholder="pedidos@..." value="${esc(c.fabricaEmail)}"></label>
    </div>
    <div class="bloco"><h3><span class="h-ic">${IC.soma} Tabela de preços</span><small>valor do par</small></h3>
      <p style="margin:0 0 8px;font-size:13px;color:var(--suave)">O preço vale para todas as cores da mesma referência e já entra automaticamente no pedido.</p>
      ${modelos.map(p => `<div class="preco-linha"><div>${esc(p.nome)} — Ref. ${esc(p.ref)}<small>${esc(p.secao)}</small></div>
        <input inputmode="decimal" placeholder="R$ 0,00" data-preco="${esc(chavePreco(p))}" value="${D.precos[chavePreco(p)] ? String(D.precos[chavePreco(p)]).replace('.', ',') : ''}"></div>`).join('')}
    </div>
    <div class="bloco"><h3><span class="h-ic">${IC.pasta} Cópia de segurança</span></h3>
      <p style="margin:0 0 8px;font-size:13px;color:var(--suave)">Os dados ficam salvos neste celular. Faça uma cópia de vez em quando, ou para passar para outro aparelho.</p>
      <button class="btn excel" id="xlsAjustes" style="margin-bottom:9px">${IC.excel} Exportar pedidos para Excel</button>
      <div class="btns dois"><button class="btn sec" id="exportar">Cópia de segurança</button>
        <label class="btn sec" style="margin:0">Importar<input type="file" id="importar" accept=".json,application/json" hidden></label></div>
    </div>
    <p class="rodape">Botinas Couro Forte · Uberaba-MG · desde 1990<br>${CATALOGO.length} modelos no catálogo</p>`;

  $$('[data-k]').forEach(i => i[i.tagName === 'SELECT' ? 'onchange' : 'oninput'] = () => {
    D.config[i.dataset.k] = i.value;
    if (i.dataset.k === 'fabricaZap') $('.fab-fixo b').textContent = i.value || FABRICA_ZAP;
    if (i.dataset.k === 'formaPadrao' && !D.atual.itens.length) D.atual.formaPag = i.value;
    salvar(); renderTopo();
  });
  $('[data-k=fabricaZap]').onblur = e => { if (!e.target.value.trim()) { D.config.fabricaZap = FABRICA_ZAP; salvar(); renderConfig(); } };
  $$('[data-preco]').forEach(i => i.oninput = () => {
    const v = numero(i.value); if (v) D.precos[i.dataset.preco] = v; else delete D.precos[i.dataset.preco]; salvar();
  });
  $('#xlsAjustes').onclick = () => exportarExcel(D.pedidos);
  $('#exportar').onclick = () => {
    const blob = new Blob([JSON.stringify(D, null, 1)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `courofort-backup-${new Date().toLocaleDateString('sv')}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  $('#importar').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    f.text().then(async t => {
      const novo = JSON.parse(t);
      if (!novo || !Array.isArray(novo.pedidos)) throw 0;
      if (!await confirmar('Substituir os dados deste aparelho pela cópia?', 'Substituir')) return;
      localStorage.setItem(CHAVE, JSON.stringify(novo)); carregar(); salvar(); renderTopo(); renderConfig(); aviso('Dados importados ✔');
    }).catch(() => aviso('Arquivo inválido'));
  };
}

/* ---------------- Início ---------------- */
renderTopo(); atualizarBadge(); renderCatalogo();
document.addEventListener('keydown', e => { if (e.key === 'Escape') { fecharFolha(); $('#zoom').hidden = true; } });

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// Guarda o app e as fotos no celular para funcionar sem internet.
const VERSAO = 'courofort-v5';
importScripts('catalogo.js');
const ARQUIVOS = ['./', 'index.html', 'style.css', 'app.js', 'catalogo.js', 'cidades.js', 'lib/xlsx.mini.min.js', 'manifest.json',
  'img/logo.png', 'img/logo-escura.png', 'icons/icon-192.png', 'icons/icon-512.png',
  ...CATALOGO.map(p => p.img)];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});

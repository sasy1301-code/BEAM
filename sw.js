/* BEAM service worker: the game keeps working with no connection.
   The page itself is fetched fresh whenever the network answers, so updates arrive on the next visit;
   everything else (clips, icons) is served from the cache first. Bump VERSION when those files change. */
const VERSION = 'beam-v140';
const SHELL = ['./', 'css/beam.css', 'js/levels.js', 'js/game.js', 'media/font/fredoka-a.woff2', 'media/font/fredoka-b.woff2', 'media/inline/bug.webp', 'media/inline/logo.webp', 'manifest.webmanifest', 'icon.webp', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/favicon-32.png', 'icons/favicon-96.png', 'icons/apple-180.png', 'media/cheer2.mp4', 'media/fly.mp4', 'media/hero.webp', 'media/garden/bg.webp', 'media/map/bg.webp', 'media/ui/shop.webp', 'media/ui/home.webp', 'media/ui/invite.webp', 'media/ui/trophy.webp', 'media/ui/decor.webp', 'media/ui/duel.webp', 'media/ui/medal.webp', 'media/ui/calendar.webp', 'media/ui/gift.webp', 'media/ui/help.webp', 'media/ui/gear.webp', 'media/ui/star.webp', 'media/splash/bg.webp', 'media/splash/logo.webp', 'media/splash/fly.webp', 'media/ui/coin1.webp', 'media/ui/coin2.webp', 'media/ui/coin3.webp', 'media/ui/t-reset.webp', 'media/ui/t-mirror.webp', 'media/ui/t-hint.webp', 'media/ui/t-hammer.webp', 'media/board/frame.webp', 'media/board/bg.webp', 'media/board/t-blue.webp', 'media/board/t-green.webp', 'media/board/t-orange.webp', 'media/board/t-purple.webp', 'media/board/wall.webp', 'media/board/bomb.webp', 'media/board/mir-a.webp', 'media/board/mir-b.webp', 'media/board/star.webp', 'media/board/star-off.webp', 'media/board/fly.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // video elements ask for byte ranges; answer those from the cached file so clips also play offline
  if (req.headers.has('range')) {
    e.respondWith(caches.match(req.url).then(async hit => {
      if (!hit) return fetch(req);
      const buf = await hit.arrayBuffer(), m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range')) || [];
      const start = m[1] ? +m[1] : 0, end = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
      return new Response(buf.slice(start, end + 1), { status: 206, headers: {
        'Content-Type': hit.headers.get('Content-Type') || 'video/mp4', 'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`, 'Content-Length': String(end - start + 1) } });
    }));
    return;
  }
  const page = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (page) {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return r;
  })));
});

// Klasseredskaber – service worker. Gør app'en tilgængelig uden net.
const CACHE='klasseredskaber-2026-11-24-7';
const FILES=['./','./klasseredskaber.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('klasseredskaber-2')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 // sider: hent nyeste version når der er net, ellers den gemte
 if(r.mode==='navigate'){e.respondWith(fetch(r.url,{cache:'no-cache',credentials:'same-origin'}).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('./klasseredskaber.html',c));return res}).catch(()=>caches.match('./klasseredskaber.html')));return}
 // skrifttyper og app-filer: brug den gemte, hent i baggrunden
 if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res}).catch(()=>hit);return hit||net}))}
});

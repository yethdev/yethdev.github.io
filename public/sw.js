const CACHE = 'yeth23'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).then((res) => {
        caches.open(CACHE).then((c) => c.put(request, res.clone()))
        return res
      }).catch(() => caches.match('/index.html'))
    )
    return
  }

  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((res) => {
          caches.open(CACHE).then((c) => c.put(request, res.clone()))
          return res
        })
      )
    )
    return
  }

  e.respondWith(
    caches.match(request).then((cached) => {
      const net = fetch(request).then((res) => {
        caches.open(CACHE).then((c) => c.put(request, res.clone()))
        return res
      })
      return cached || net
    })
  )
})

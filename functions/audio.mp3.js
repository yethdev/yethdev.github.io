export async function onRequest(context) {
  const req = context.request
  const mode = req.headers.get('sec-fetch-mode')
  const dest = req.headers.get('sec-fetch-dest')

  if (mode !== 'cors' || dest !== 'audio') {
    return new Response('not found', { status: 404 })
  }

  const res = await context.next()
  const headers = new Headers(res.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Cache-Control', 'no-store')
  headers.set('Content-Disposition', 'inline')
  return new Response(res.body, { ...res, headers })
}

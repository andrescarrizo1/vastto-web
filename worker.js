addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  
  if (response.status === 404) {
    const url = new URL(request.url)
    return Response.redirect(`${url.origin}/?msg=product_unavailable`, 302)
  }
  
  return response
}

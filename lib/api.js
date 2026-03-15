async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  return res.json()
}

async function putJSON(url, data) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  return res.json()
}

function buildQuery(params = {}) {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') q.set(k, v)
  }
  const str = q.toString()
  return str ? `?${str}` : ''
}

export function getOrders(params = {}) {
  return fetchJSON(`/api/orders${buildQuery(params)}`)
}

export function getOrder(id) {
  return fetchJSON(`/api/orders/${id}`)
}

export function updateOrder(id, data) {
  return putJSON(`/api/orders/${id}`, data)
}

export function getProducts(params = {}) {
  return fetchJSON(`/api/products${buildQuery(params)}`)
}

export function getCustomers(params = {}) {
  return fetchJSON(`/api/customers${buildQuery(params)}`)
}

export function getAnalytics() {
  return fetchJSON('/api/analytics')
}

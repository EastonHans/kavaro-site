// Lightweight fetch-based API client (no axios needed in the Worker runtime)
const TIMEOUT = 30000

async function request<T = any>(path: string, options: RequestInit = {}): Promise<{ data: T }> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT)
  try {
    const res = await fetch(`/api${path}`, {
      ...options,
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err: any = new Error(json?.message || `Request failed (${res.status})`)
      err.response = { data: json, status: res.status }
      throw err
    }
    return { data: json as T }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      err.message = 'Request timed out. Check your connection and try again.'
    } else if (!err.response) {
      err.message = err.message || 'Cannot reach the server.'
    }
    throw err
  } finally {
    clearTimeout(t)
  }
}

export const mpesaAPI = {
  stkPush: (data: any) => request('/mpesa/stk-push', { method: 'POST', body: JSON.stringify(data) }),
  queryStatus: (checkoutRequestId: string) =>
    request('/mpesa/query', { method: 'POST', body: JSON.stringify({ checkoutRequestId }) }),
}

export const contactAPI = {
  send: (data: any) => request('/contact/send', { method: 'POST', body: JSON.stringify(data) }),
  sendPaymentConfirmation: (data: any) =>
    request('/contact/payment-confirmation', { method: 'POST', body: JSON.stringify(data) }),
}

export const bankAPI = {
  getDetails: () => request('/bank/details'),
}

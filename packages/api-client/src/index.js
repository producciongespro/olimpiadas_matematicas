const DEFAULT_BASE_URL = 'http://localhost:3600/api/v1'

export function createApiClient({ baseUrl = import.meta.env?.VITE_API_URL || DEFAULT_BASE_URL, getToken = () => null } = {}) {
  const request = async (path, options = {}) => {
    const token = getToken()
    const headers = new Headers(options.headers)
    if (token) headers.set('Authorization', `Bearer ${token}`)
    if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
    const response = await fetch(`${baseUrl}${path}`, { ...options, headers })
    const body = response.status === 204 ? null : await response.json().catch(() => null)
    if (!response.ok) throw new Error(body?.message || 'No fue posible completar la solicitud.')
    return body?.data
  }

  return {
    carousel: () => request('/carousel'), events: () => request('/events'), event: (slug) => request(`/events/${encodeURIComponent(slug)}`),
    adminCarousel: () => request('/admin/carousel'), createSlide: (form) => request('/admin/carousel', { method: 'POST', body: form }),
    updateSlide: (id, data) => request(`/admin/carousel/${id}`, { method: 'PUT', body: JSON.stringify(data) }), archiveSlide: (id) => request(`/admin/carousel/${id}`, { method: 'DELETE' }),
    reorderSlides: (ids) => request('/admin/carousel/order', { method: 'PUT', body: JSON.stringify({ ids }) }), adminEvents: () => request('/admin/events'),
    adminEvent: (id) => request(`/admin/events/${id}`), createEvent: (data) => request('/admin/events', { method: 'POST', body: JSON.stringify(data) }),
    updateEvent: (id, data) => request(`/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }), archiveEvent: (id) => request(`/admin/events/${id}`, { method: 'DELETE' }),
    addEventImage: (id, form) => request(`/admin/events/${id}/images`, { method: 'POST', body: form }), updateEventImage: (id, data) => request(`/admin/event-images/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteEventImage: (id) => request(`/admin/event-images/${id}`, { method: 'DELETE' }), reorderEventImages: (id, ids) => request(`/admin/events/${id}/images/order`, { method: 'PUT', body: JSON.stringify({ ids }) }),
  }
}

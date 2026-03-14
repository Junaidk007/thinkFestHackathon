const configuredBaseUrl =  'http://localhost:3000'

export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, '')

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  slots: {
    list: '/slots',
  },
  bookings: {
    my: '/bookings/my',
    active: '/bookings/active',
    create: '/bookings',
    cancel: '/bookings/:id/cancel',
  },
  staff: {
    dashboard: '/staff/dashboard',
    bookings: '/staff/bookings',
    checkIn: '/staff/check-in/:bookingId',
    checkOut: '/staff/check-out/:bookingId',
  },
  admin: {
    overview: '/admin/overview',
    slots: '/admin/slots',
    bookings: '/admin/bookings',
    staff: '/admin/staff',
    revenue: '/admin/revenue',
    pricing: '/admin/pricing',
  },
}

export const API_KEYS = {
  token: 'Authorization',
  role: 'role',
  userId: 'userId',
}

export function withApiBase(path) {
  return `${API_BASE_URL}${path}`
}

export function withPathParams(path, params = {}) {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`:${key}`, String(value)),
    path
  )
}

export function normalizeRole(role) {
  return String(role || '').trim().toLowerCase()
}

export function normalizeStatus(status) {
  return String(status || '').trim().toUpperCase()
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { API_BASE_URL, API_ENDPOINTS, normalizeStatus, withPathParams } from '../utils/apiConfig'
import { apiRequest } from '../utils/apiClient'
import { useAuth } from './useAuth'

const ParkingSystemContext = createContext(null)

function normalizeSlot(slot) {
  return {
    id: slot?._id,
    slotNumber: slot?.slotNumber || '-',
    zone: slot?.location || '-',
    type: slot?.slotType || '-',
    status: normalizeStatus(slot?.status),
    rowLabel: slot?.rowLabel || '',
    columnNumber: slot?.columnNumber || null,
  }
}

function normalizeBooking(item) {
  const user = item?.userId || {}
  const slot = item?.slotId || {}
  const checkInAt = item?.checkInTime || null
  const checkOutAt = item?.checkOutTime || null
  const billedHours =
    checkInAt && checkOutAt
      ? Math.max(1, Math.ceil((new Date(checkOutAt) - new Date(checkInAt)) / (1000 * 60 * 60)))
      : null

  return {
    id: item?._id,
    bookingId: item?.bookingId || item?._id,
    userId: typeof user === 'object' ? user?._id : user,
    userName: typeof user === 'object' ? user?.name : '-',
    userEmail: typeof user === 'object' ? user?.email : '-',
    slotObjectId: typeof slot === 'object' ? slot?._id : slot,
    slotId: typeof slot === 'object' ? slot?.slotNumber : '-',
    vehicleNumber: item?.vehicleNumber || '-',
    vehicleType: item?.vehicleType || 'CAR',
    status: normalizeStatus(item?.status),
    bookedAt: item?.bookingTime || item?.createdAt,
    checkInAt,
    checkOutAt,
    billedHours,
    totalAmount: Number(item?.totalAmount || 0),
  }
}

function emptyMetrics() {
  return {
    totalSlots: 0,
    availableSlots: 0,
    bookedSlots: 0,
    occupiedSlots: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
  }
}

export function ParkingSystemProvider({ children }) {
  const { token, user } = useAuth()
  const [slots, setSlots] = useState([])
  const [bookings, setBookings] = useState([])
  const [pricing, setPricing] = useState({
    vehicleType: 'CAR',
    pricePerHour: 0,
    minimumHours: 1,
  })
  const [staffList, setStaffList] = useState([])
  const [metrics, setMetrics] = useState(emptyMetrics())
  const [loading, setLoading] = useState(false)

  const fetchForUser = useCallback(async () => {
    const [slotPayload, bookingPayload] = await Promise.all([
      apiRequest(API_ENDPOINTS.slots.list, {
        token,
        query: { status: 'AVAILABLE' },
      }),
      apiRequest(API_ENDPOINTS.bookings.my, { token }),
    ])

    const normalizedSlots = (slotPayload?.slots || []).map(normalizeSlot)
    const normalizedBookings = (bookingPayload?.bookings || []).map(normalizeBooking)

    setSlots(normalizedSlots)
    setBookings(normalizedBookings)

    const totalRevenue = normalizedBookings
      .filter((item) => item.status === 'COMPLETED')
      .reduce((sum, item) => sum + (item.totalAmount || 0), 0)

    setMetrics({
      totalSlots: normalizedSlots.length,
      availableSlots: normalizedSlots.length,
      bookedSlots: 0,
      occupiedSlots: 0,
      activeBookings: normalizedBookings.filter((item) => ['BOOKED', 'ACTIVE'].includes(item.status)).length,
      completedBookings: normalizedBookings.filter((item) => item.status === 'COMPLETED').length,
      totalRevenue,
    })
  }, [token])

  const fetchForStaff = useCallback(async () => {
    const [dashboardPayload, bookingsPayload, slotPayload] = await Promise.all([
      apiRequest(API_ENDPOINTS.staff.dashboard, { token }),
      apiRequest(API_ENDPOINTS.staff.bookings, { token }),
      apiRequest(API_ENDPOINTS.slots.list, { token }),
    ])

    const dashboard = dashboardPayload?.dashboard || {}
    const normalizedBookings = (bookingsPayload?.bookings || []).map(normalizeBooking)
    const normalizedSlots = (slotPayload?.slots || []).map(normalizeSlot)

    setBookings(normalizedBookings)
    setSlots(normalizedSlots)
    setMetrics({
      totalSlots: normalizedSlots.length,
      availableSlots: normalizedSlots.filter((slot) => slot.status === 'AVAILABLE').length,
      bookedSlots: Number(dashboard.bookedCount || 0),
      occupiedSlots: Number(dashboard.occupiedSlots || 0),
      activeBookings: Number(dashboard.activeCount || 0) + Number(dashboard.bookedCount || 0),
      completedBookings: Number(dashboard.completedToday || 0),
      totalRevenue: 0,
    })
  }, [token])

  const fetchForAdmin = useCallback(async () => {
    const [overviewPayload, bookingsPayload, slotsPayload, staffPayload] = await Promise.all([
      apiRequest(API_ENDPOINTS.admin.overview, { token }),
      apiRequest(API_ENDPOINTS.admin.bookings, { token }),
      apiRequest(API_ENDPOINTS.admin.slots, { token }),
      apiRequest(API_ENDPOINTS.admin.staff, { token }),
    ])

    const overview = overviewPayload?.overview || {}
    const pricingList = overview?.pricing || []
    const selectedPricing = pricingList.find((item) => item.vehicleType === 'CAR') || pricingList[0]

    setPricing({
      vehicleType: selectedPricing?.vehicleType || 'CAR',
      pricePerHour: Number(selectedPricing?.pricePerHour || 0),
      minimumHours: Number(selectedPricing?.minimumHours || 1),
    })

    const normalizedBookings = (bookingsPayload?.bookings || []).map(normalizeBooking)
    const normalizedSlots = (slotsPayload?.slots || []).map(normalizeSlot)
    const normalizedStaff = (staffPayload?.staff || []).map((item) => ({
      id: item._id,
      name: item.name,
      email: item.email,
      department: item.department || '-',
      vehicleNumber: item.vehicleNumber || '-',
      role: item.role,
      isActive: item.isActive,
    }))

    setBookings(normalizedBookings)
    setSlots(normalizedSlots)
    setStaffList(normalizedStaff)
    setMetrics({
      totalSlots: Number(overview.totalSlots || 0),
      availableSlots: Number(overview.availableSlots || 0),
      bookedSlots: Number(overview.bookedSlots || 0),
      occupiedSlots: Number(overview.occupiedSlots || 0),
      activeBookings: Number(overview.bookedSlots || 0) + Number(overview.occupiedSlots || 0),
      completedBookings: Number(overview.totalCompletedBookings || 0),
      totalRevenue: Number(overview.totalRevenue || 0),
    })
  }, [token])

  const refreshData = useCallback(async () => {
    if (!token || !user?.role) {
      setSlots([])
      setBookings([])
      setStaffList([])
      setMetrics(emptyMetrics())
      return
    }

    setLoading(true)
    try {
      if (user.role === 'user') {
        await fetchForUser()
      } else if (user.role === 'staff') {
        await fetchForStaff()
      } else if (user.role === 'admin') {
        await fetchForAdmin()
      }
    } finally {
      setLoading(false)
    }
  }, [token, user?.role, fetchForUser, fetchForStaff, fetchForAdmin])

  useEffect(() => {
    refreshData().catch(() => {
      setSlots([])
      setBookings([])
      setMetrics(emptyMetrics())
    })
  }, [refreshData])

  const availableSlots = useMemo(
    () => slots.filter((slot) => slot.status === 'AVAILABLE'),
    [slots]
  )

  const bookSlot = async ({ slotId, vehicleNumber, vehicleType = 'CAR' }) => {
    try {
      const payload = await apiRequest(API_ENDPOINTS.bookings.create, {
        method: 'POST',
        token,
        body: {
          slotId,
          vehicleNumber,
          vehicleType,
        },
      })

      await refreshData()
      return { ok: true, booking: normalizeBooking(payload?.booking || {}) }
    } catch (error) {
      return { ok: false, message: error.message }
    }
  }

  const cancelBooking = async (bookingId) => {
    try {
      await apiRequest(withPathParams(API_ENDPOINTS.bookings.cancel, { id: bookingId }), {
        method: 'PATCH',
        token,
      })
      await refreshData()
      return { ok: true }
    } catch (error) {
      return { ok: false, message: error.message }
    }
  }

  const checkIn = async (bookingId) => {
    try {
      await apiRequest(withPathParams(API_ENDPOINTS.staff.checkIn, { bookingId }), {
        method: 'PATCH',
        token,
      })
      await refreshData()
      return { ok: true }
    } catch (error) {
      return { ok: false, message: error.message }
    }
  }

  const checkOut = async (bookingId) => {
    try {
      const payload = await apiRequest(withPathParams(API_ENDPOINTS.staff.checkOut, { bookingId }), {
        method: 'PATCH',
        token,
      })
      await refreshData()
      return {
        ok: true,
        totalAmount: Number(payload?.bill?.totalAmount || 0),
        usedHours: Number(payload?.bill?.totalHours || 0),
      }
    } catch (error) {
      return { ok: false, message: error.message }
    }
  }

  const updatePricing = async ({ vehicleType = 'CAR', pricePerHour, minimumHours = 1 }) => {
    try {
      await apiRequest(API_ENDPOINTS.admin.pricing, {
        method: 'PATCH',
        token,
        body: {
          vehicleType,
          pricePerHour: Number(pricePerHour),
          minimumHours: Number(minimumHours),
        },
      })
      await refreshData()
      return { ok: true }
    } catch (error) {
      return { ok: false, message: error.message }
    }
  }

  const createSlot = async ({ slotNumber, slotType, location, rowLabel, columnNumber }) => {
    try {
      await apiRequest(API_ENDPOINTS.admin.slots, {
        method: 'POST',
        token,
        body: {
          slotNumber,
          slotType,
          location,
          rowLabel,
          columnNumber,
        },
      })
      await refreshData()
      return { ok: true }
    } catch (error) {
      return { ok: false, message: error.message }
    }
  }

  const createStaff = async ({ name, email, password, department, vehicleNumber }) => {
    try {
      await apiRequest(API_ENDPOINTS.admin.staff, {
        method: 'POST',
        token,
        body: {
          name,
          email,
          password,
          department,
          vehicleNumber,
        },
      })
      await refreshData()
      return { ok: true }
    } catch (error) {
      return { ok: false, message: error.message }
    }
  }

  const backendContract = {
    baseUrl: API_BASE_URL,
    authLoginUrl: API_ENDPOINTS.auth.login,
    authRegisterUrl: API_ENDPOINTS.auth.register,
    slotsListUrl: API_ENDPOINTS.slots.list,
    myBookingsUrl: API_ENDPOINTS.bookings.my,
    bookingCreateUrl: API_ENDPOINTS.bookings.create,
    bookingCancelUrlTemplate: API_ENDPOINTS.bookings.cancel,
    staffCheckInUrlTemplate: API_ENDPOINTS.staff.checkIn,
    staffCheckOutUrlTemplate: API_ENDPOINTS.staff.checkOut,
    adminOverviewUrl: API_ENDPOINTS.admin.overview,
    adminBookingsUrl: API_ENDPOINTS.admin.bookings,
    adminStaffUrl: API_ENDPOINTS.admin.staff,
    adminSlotsUrl: API_ENDPOINTS.admin.slots,
    pricingUpdateUrl: API_ENDPOINTS.admin.pricing,
  }

  const value = {
    slots,
    bookings,
    staffList,
    pricing,
    metrics,
    loading,
    availableSlots,
    refreshData,
    bookSlot,
    cancelBooking,
    checkIn,
    checkOut,
    updatePricing,
    createSlot,
    createStaff,
    backendContract,
  }

  return (
    <ParkingSystemContext.Provider value={value}>
      {children}
    </ParkingSystemContext.Provider>
  )
}

export function useParkingSystem() {
  const context = useContext(ParkingSystemContext)
  if (!context) {
    throw new Error('useParkingSystem must be used within ParkingSystemProvider')
  }
  return context
}

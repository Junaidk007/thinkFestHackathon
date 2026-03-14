import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useParkingSystem } from '../hooks/useParkingSystem'

export default function UserBookSlot() {
  const { user } = useAuth()
  const { availableSlots, bookings, bookSlot } = useParkingSystem()

  const [slotId, setSlotId] = useState('')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [vehicleType, setVehicleType] = useState('CAR')

  const activeBooking = useMemo(
    () => bookings.find(item => item.userId === user?.id && ['BOOKED', 'ACTIVE'].includes(item.status)),
    [bookings, user?.id]
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!slotId || !vehicleNumber.trim()) {
      toast.error('Select a slot and enter vehicle number')
      return
    }

    const result = await bookSlot({
      slotId,
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      vehicleType,
    })

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success(`Slot ${slotId} booked successfully`)
    setSlotId('')
    setVehicleNumber('')
    setVehicleType('CAR')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Book Parking Slot</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Rule enforced: one active booking per user and no double booking on occupied/booked slots.
        </p>
      </div>

      {activeBooking && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-700 dark:text-amber-300">
          You already have an active booking ({activeBooking.bookingId}) on slot {activeBooking.slotId}. Cancel or complete it first.
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-300">Select Available Slot</label>
          <select className="input-field mt-1" value={slotId} onChange={(event) => setSlotId(event.target.value)}>
            <option value="">Choose slot</option>
            {availableSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.slotNumber} - {slot.zone} ({slot.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 dark:text-gray-300">Vehicle Type</label>
          <select className="input-field mt-1" value={vehicleType} onChange={(event) => setVehicleType(event.target.value)}>
            <option value="CAR">CAR</option>
            <option value="BIKE">BIKE</option>
            <option value="SUV">SUV</option>
            <option value="EV">EV</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 dark:text-gray-300">Vehicle Number</label>
          <input
            className="input-field mt-1"
            value={vehicleNumber}
            onChange={(event) => setVehicleNumber(event.target.value)}
            placeholder="UP16AB1122"
          />
        </div>

        <button disabled={Boolean(activeBooking)} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          Confirm Booking
        </button>
      </form>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <h3 className="font-display font-semibold text-gray-900 dark:text-white">Currently Available Slots</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Only slots with status "Available" are shown below and in the dropdown.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
                <th className="py-2">Slot ID</th>
                <th className="py-2">Zone</th>
                <th className="py-2">Type</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {availableSlots.map((slot) => (
                <tr key={slot.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2">{slot.slotNumber}</td>
                  <td className="py-2">{slot.zone}</td>
                  <td className="py-2">{slot.type}</td>
                  <td className="py-2">{slot.status}</td>
                </tr>
              ))}
              {availableSlots.length === 0 && (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={4}>No slots are currently available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

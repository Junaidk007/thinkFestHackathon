import toast from 'react-hot-toast'
import { useParkingSystem } from '../hooks/useParkingSystem'

export default function StaffOperations() {
  const { bookings, checkIn, checkOut, backendContract } = useParkingSystem()

  const handleCheckIn = async (bookingId) => {
    const result = await checkIn(bookingId)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success('Vehicle checked in')
  }

  const handleCheckOut = async (bookingId) => {
    const result = await checkOut(bookingId)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success(`Checked out. Bill: INR ${result.totalAmount} (${result.usedHours} hour)`) 
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Check-In / Check-Out Operations</h2>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
              <th className="p-3">Booking</th>
              <th className="p-3">User</th>
              <th className="p-3">Slot</th>
              <th className="p-3">Vehicle Number</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-3">{item.bookingId}</td>
                <td className="p-3">{item.userName}</td>
                <td className="p-3">{item.slotId}</td>
                <td className="p-3">{item.vehicleNumber}</td>
                <td className="p-3">{item.status}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCheckIn(item.id)}
                      disabled={item.status !== 'BOOKED'}
                      className="btn-secondary text-xs py-2 px-3 disabled:opacity-50"
                    >
                      Check-In
                    </button>
                    <button
                      onClick={() => handleCheckOut(item.id)}
                      disabled={item.status !== 'ACTIVE'}
                      className="btn-primary text-xs py-2 px-3 disabled:opacity-50"
                    >
                      Check-Out
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Backend placeholder endpoints</p>
        <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">Check in: {backendContract.staffCheckInUrlTemplate}</p>
        <p className="text-sm text-gray-700 dark:text-gray-200">Check out: {backendContract.staffCheckOutUrlTemplate}</p>
      </div>
    </div>
  )
}

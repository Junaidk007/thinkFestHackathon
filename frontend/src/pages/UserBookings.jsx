import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useParkingSystem } from '../hooks/useParkingSystem'

export default function UserBookings() {
  const { user } = useAuth()
  const { bookings, cancelBooking } = useParkingSystem()

  const myBookings = bookings.filter(item => item.userId === user?.id)

  const handleCancel = async (bookingId) => {
    const result = await cancelBooking(bookingId)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success('Booking cancelled')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h2>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
              <th className="p-3">Booking ID</th>
              <th className="p-3">Slot</th>
              <th className="p-3">Vehicle Number</th>
              <th className="p-3">Activity</th>
              <th className="p-3">Status</th>
              <th className="p-3">Booked At</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {myBookings.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-3">{item.bookingId}</td>
                <td className="p-3">{item.slotId}</td>
                <td className="p-3">{item.vehicleNumber}</td>
                <td className="p-3">
                  {['BOOKED', 'ACTIVE'].includes(item.status) ? 'Active' : 'Inactive'}
                </td>
                <td className="p-3">{item.status}</td>
                <td className="p-3">{item.bookedAt ? new Date(item.bookedAt).toLocaleString() : '-'}</td>
                <td className="p-3">{item.totalAmount ? `INR ${item.totalAmount}` : '-'}</td>
                <td className="p-3">
                  {item.status === 'BOOKED' ? (
                    <button onClick={() => handleCancel(item.id)} className="btn-secondary text-xs py-2 px-3">
                      Cancel
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">No action</span>
                  )}
                </td>
              </tr>
            ))}
            {myBookings.length === 0 && (
              <tr>
                <td className="p-8 text-center text-gray-500" colSpan={8}>No bookings available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

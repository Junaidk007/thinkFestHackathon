import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useParkingSystem } from '../hooks/useParkingSystem'

export default function UserOverview() {
  const { user } = useAuth()
  const { bookings, backendContract } = useParkingSystem()

  const myBookings = bookings.filter(item => item.userId === user?.id)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Book campus parking slots, cancel before check-in, and track your usage history.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
          <Link to="/user/book-slot" className="btn-primary text-xs px-4 py-2">Book New Slot</Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Booking ID</th>
                <th className="py-2">Vehicle Number</th>
                <th className="py-2">Activity</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {myBookings.slice(0, 5).map((item) => (
                <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2">{item.bookingId}</td>
                  <td className="py-2">{item.vehicleNumber}</td>
                  <td className="py-2">
                    {['BOOKED', 'ACTIVE'].includes(item.status) ? 'Active' : 'Inactive'}
                  </td>
                  <td className="py-2">{item.status}</td>
                </tr>
              ))}
              {myBookings.length === 0 && (
                <tr>
                  <td className="py-6 text-gray-500" colSpan={4}>No bookings yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Backend placeholder endpoints</p>
        <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">Create booking: {backendContract.bookingCreateUrl}</p>
        <p className="text-sm text-gray-700 dark:text-gray-200">Cancel booking: {backendContract.bookingCancelUrlTemplate}</p>
      </div>
    </div>
  )
}

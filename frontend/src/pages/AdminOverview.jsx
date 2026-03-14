import { DollarSign, ParkingCircle, Clock3 } from 'lucide-react'
import { useParkingSystem } from '../hooks/useParkingSystem'

function Stat({ title, value, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
      <div className={`w-9 h-9 rounded-xl grid place-items-center mb-3 ${accent}`}>
        <Icon size={16} />
      </div>
      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</p>
      <p className="font-display text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  )
}

export default function AdminOverview() {
  const { metrics, bookings, backendContract } = useParkingSystem()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Admin Control Center</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">System-wide monitoring for slots, billing, and activity.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Stat title="Total Revenue" value={`INR ${metrics.totalRevenue}`} icon={DollarSign} accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" />
        <Stat title="Total Slots" value={metrics.totalSlots} icon={ParkingCircle} accent="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" />
        <Stat title="Active Bookings" value={metrics.activeBookings} icon={Clock3} accent="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <h3 className="font-display font-semibold text-gray-900 dark:text-white">Slot Status Snapshot</h3>
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs text-gray-400">Available</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.availableSlots}</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs text-gray-400">Booked</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.bookedSlots}</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs text-gray-400">Occupied</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.occupiedSlots}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <h3 className="font-display font-semibold text-gray-900 dark:text-white">Live Booking Monitor</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          New bookings from users appear here with slot and vehicle details.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
                <th className="py-2">Booking ID</th>
                <th className="py-2">User</th>
                <th className="py-2">Slot</th>
                <th className="py-2">Vehicle Number</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 8).map((item) => (
                <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2">{item.bookingId}</td>
                  <td className="py-2">{item.userName}</td>
                  <td className="py-2">{item.slotId}</td>
                  <td className="py-2">{item.vehicleNumber}</td>
                  <td className="py-2">{item.status}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={5}>No bookings available yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Backend placeholder endpoints</p>
        <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">Overview: {backendContract.adminOverviewUrl}</p>
        <p className="text-sm text-gray-700 dark:text-gray-200">Bookings: {backendContract.adminBookingsUrl}</p>
      </div>
    </div>
  )
}

import { Users, CarFront, CircleDollarSign } from 'lucide-react'
import { useParkingSystem } from '../hooks/useParkingSystem'

function Item({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 grid place-items-center mb-3">
        <Icon size={16} className="text-gray-700 dark:text-gray-300" />
      </div>
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-2xl font-display font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  )
}

export default function StaffOverview() {
  const { metrics } = useParkingSystem()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Parking Staff Desk</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage on-ground check-in and check-out flow.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Item title="Booked Slots" value={metrics.bookedSlots} icon={Users} />
        <Item title="Occupied Slots" value={metrics.occupiedSlots} icon={CarFront} />
        <Item title="Total Revenue" value={`INR ${metrics.totalRevenue}`} icon={CircleDollarSign} />
      </div>
    </div>
  )
}

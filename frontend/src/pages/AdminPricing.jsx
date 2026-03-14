import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParkingSystem } from '../hooks/useParkingSystem'

export default function AdminPricing() {
  const { pricing, bookings, updatePricing, backendContract } = useParkingSystem()
  const [hourlyRate, setHourlyRate] = useState(pricing.pricePerHour)
  const [vehicleType, setVehicleType] = useState(pricing.vehicleType || 'CAR')
  const [minimumHours, setMinimumHours] = useState(pricing.minimumHours || 1)

  useEffect(() => {
    setHourlyRate(pricing.pricePerHour)
    setVehicleType(pricing.vehicleType || 'CAR')
    setMinimumHours(pricing.minimumHours || 1)
  }, [pricing])

  const completed = bookings.filter(item => item.status === 'COMPLETED')

  const handleSave = async () => {
    const result = await updatePricing({
      vehicleType,
      pricePerHour: hourlyRate,
      minimumHours,
    })
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success('Pricing updated')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Pricing and Revenue</h2>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">Current pricing policy</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="text-xs text-gray-500">Vehicle Type</label>
            <select
              className="input-field mt-1"
              value={vehicleType}
              onChange={(event) => setVehicleType(event.target.value)}
            >
              <option value="CAR">CAR</option>
              <option value="BIKE">BIKE</option>
              <option value="SUV">SUV</option>
              <option value="EV">EV</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Hourly Rate (INR)</label>
            <input
              className="input-field mt-1"
              value={hourlyRate}
              onChange={(event) => setHourlyRate(event.target.value)}
              type="number"
              min={1}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Minimum charge duration</label>
            <input
              className="input-field mt-1"
              value={minimumHours}
              type="number"
              min={1}
              onChange={(event) => setMinimumHours(event.target.value)}
            />
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary mt-4">Save Pricing</button>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
              <th className="p-3">Booking ID</th>
              <th className="p-3">Slot</th>
              <th className="p-3">Hours</th>
              <th className="p-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {completed.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.slotId}</td>
                <td className="p-3">{item.billedHours}</td>
                <td className="p-3">INR {item.totalAmount}</td>
              </tr>
            ))}
            {completed.length === 0 && (
              <tr>
                <td className="p-6 text-gray-500" colSpan={4}>No completed bookings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Backend placeholder endpoint</p>
        <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">Update pricing: {backendContract.pricingUpdateUrl}</p>
      </div>
    </div>
  )
}

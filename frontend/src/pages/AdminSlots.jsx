import { useState } from 'react'
import toast from 'react-hot-toast'
import { useParkingSystem } from '../hooks/useParkingSystem'

export default function AdminSlots() {
  const { slots, createSlot } = useParkingSystem()

  const [form, setForm] = useState({ slotNumber: '', location: '', slotType: 'GENERAL', rowLabel: '', columnNumber: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.slotNumber.trim()) {
      toast.error('Slot ID is required')
      return
    }

    const result = await createSlot({
      slotNumber: form.slotNumber.trim().toUpperCase(),
      location: form.location.trim(),
      slotType: form.slotType,
      rowLabel: form.rowLabel.trim().toUpperCase(),
      columnNumber: form.columnNumber ? Number(form.columnNumber) : undefined,
    })

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success('Slot created')
    setForm({ slotNumber: '', location: '', slotType: 'GENERAL', rowLabel: '', columnNumber: '' })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Slot Management</h2>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 grid md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="text-xs text-gray-500">Slot ID</label>
          <input
            className="input-field mt-1"
            value={form.slotNumber}
            onChange={(event) => setForm(prev => ({ ...prev, slotNumber: event.target.value }))}
            placeholder="A-10"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Zone</label>
          <input
            className="input-field mt-1"
            value={form.location}
            onChange={(event) => setForm(prev => ({ ...prev, location: event.target.value }))}
            placeholder="Academic Block"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Slot Type</label>
          <select
            className="input-field mt-1"
            value={form.slotType}
            onChange={(event) => setForm(prev => ({ ...prev, slotType: event.target.value }))}
          >
            <option value="GENERAL">GENERAL</option>
            <option value="STUDENT">STUDENT</option>
            <option value="TEACHER">TEACHER</option>
          </select>
        </div>
        <button className="btn-primary">Add Slot</button>
      </form>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
              <th className="p-3">Slot ID</th>
              <th className="p-3">Zone</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-3">{slot.slotNumber}</td>
                <td className="p-3">{slot.zone}</td>
                <td className="p-3">{slot.type}</td>
                <td className="p-3">{slot.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

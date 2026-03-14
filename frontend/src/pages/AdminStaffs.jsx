import { useState } from 'react'
import toast from 'react-hot-toast'
import { useParkingSystem } from '../hooks/useParkingSystem'

export default function AdminStaffs() {
  const { staffList, createStaff, backendContract } = useParkingSystem()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    vehicleNumber: '',
  })

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error('Name, email and password are required')
      return
    }

    const result = await createStaff({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      department: form.department.trim(),
      vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
    })

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success('Staff account created')
    setForm({ name: '', email: '', password: '', department: '', vehicleNumber: '' })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h2>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 grid md:grid-cols-3 gap-3 items-end">
        <div>
          <label className="text-xs text-gray-500">Name</label>
          <input className="input-field mt-1" value={form.name} onChange={(e) => updateForm('name', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">Email</label>
          <input className="input-field mt-1" type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">Password</label>
          <input className="input-field mt-1" type="password" value={form.password} onChange={(e) => updateForm('password', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">Department</label>
          <input className="input-field mt-1" value={form.department} onChange={(e) => updateForm('department', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">Vehicle Number (optional)</label>
          <input className="input-field mt-1" value={form.vehicleNumber} onChange={(e) => updateForm('vehicleNumber', e.target.value)} />
        </div>
        <button className="btn-primary">Add Staff</button>
      </form>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Department</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.email}</td>
                <td className="p-3">{item.department}</td>
                <td className="p-3">{item.vehicleNumber}</td>
                <td className="p-3">{item.role}</td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td className="p-6 text-gray-500" colSpan={5}>No staff accounts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Backend placeholder endpoint</p>
        <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">Staff management: {backendContract.adminStaffUrl}</p>
      </div>
    </div>
  )
}

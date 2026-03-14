import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CarFront, ShieldCheck, UserCog } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage({ adminOnly = false, staffOnly = false }) {
  const navigate = useNavigate()
  const { login, register, loading } = useAuth()

  const [mode, setMode] = useState(staffOnly || adminOnly ? 'signin' : 'signin')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    vehicleNumber: '',
    department: '',
  })

  const roleMode = useMemo(() => {
    if (adminOnly) return 'admin'
    if (staffOnly) return 'staff'
    return 'user'
  }, [adminOnly, staffOnly])

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const routeByRole = (role) => {
    if (role === 'admin') navigate('/admin')
    else if (role === 'staff') navigate('/staff')
    else navigate('/user')
  }

  const handleAuth = async (event) => {
    event.preventDefault()

    if (!form.email.trim() || !form.password.trim()) {
      toast.error('Email and password are required')
      return
    }

    try {
      if (!adminOnly && !staffOnly && mode === 'signup') {
        if (!form.name.trim() || !form.vehicleNumber.trim() || !form.department.trim()) {
          toast.error('Name, vehicle number, and department are required for signup')
          return
        }

        const auth = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          vehicleNumber: form.vehicleNumber,
          department: form.department,
        })

        toast.success('Account created successfully')
        routeByRole(auth.user.role)
        return
      }

      const expectedRole = roleMode
      const auth = await login({
        email: form.email,
        password: form.password,
        expectedRole,
      })

      toast.success(`Welcome ${auth.user.name}`)
      routeByRole(auth.user.role)
    } catch (error) {
      toast.error(error.message || 'Authentication failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center min-h-[90vh]">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <CarFront size={14} /> Smart Campus Parking
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            {adminOnly ? 'Admin Console Access' : staffOnly ? 'Staff Console Access' : 'Campus Parking Access Portal'}
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-lg">
            {adminOnly
              ? 'Use admin credentials to manage pricing, slots, and monitor live revenue analytics.'
              : staffOnly
                ? 'Use staff credentials to handle check-in/check-out operations from the staff dashboard.'
                : 'Sign in or create a user account. Staff uses /staff and admin uses /admin.'}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAuth}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl space-y-4"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Authentication</p>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              {adminOnly ? 'Sign in as Admin' : staffOnly ? 'Sign in as Staff' : mode === 'signin' ? 'Sign in to continue' : 'Create user account'}
            </h2>
          </div>

          {!adminOnly && !staffOnly && (
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 text-sm rounded-lg ${mode === 'signin' ? 'bg-white dark:bg-gray-700' : ''}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 text-sm rounded-lg ${mode === 'signup' ? 'bg-white dark:bg-gray-700' : ''}`}
              >
                Sign Up (User)
              </button>
            </div>
          )}

          {!adminOnly && !staffOnly && mode === 'signup' && (
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-300">Full Name</label>
              <input
                className="input-field mt-1"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
              />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-300">Email</label>
            <input
              className="input-field mt-1"
              placeholder="your.email@campus.edu"
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-300">Password</label>
            <input
              className="input-field mt-1"
              placeholder="Enter password"
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
            />
          </div>

          {!adminOnly && !staffOnly && mode === 'signup' && (
            <>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-300">Vehicle Number</label>
                <input
                  className="input-field mt-1"
                  placeholder="UP16AB1122"
                  value={form.vehicleNumber}
                  onChange={(event) => updateField('vehicleNumber', event.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-300">Department</label>
                <input
                  className="input-field mt-1"
                  placeholder="Computer Science"
                  value={form.department}
                  onChange={(event) => updateField('department', event.target.value)}
                />
              </div>
            </>
          )}

          <button disabled={loading} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
            {adminOnly || staffOnly ? (
              <span className="inline-flex items-center justify-center gap-2">
                {adminOnly ? <ShieldCheck size={16} /> : <UserCog size={16} />}
                {adminOnly ? 'Enter Admin Panel' : 'Enter Staff Panel'}
              </span>
            ) : mode === 'signin' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>

          {!adminOnly && !staffOnly && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Staff login is at /staff and admin login is at /admin
            </p>
          )}
        </motion.form>
      </div>
    </div>
  )
}

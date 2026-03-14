import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, RotateCcw, AlertCircle } from 'lucide-react'

const CATEGORIES = ['Research', 'Operations', 'Finance', 'HR', 'Technology', 'Marketing', 'Legal', 'Other']
const STATUSES = ['Active', 'Pending', 'Closed']

const defaultForm = {
  name: '',
  category: '',
  status: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
}

function FloatingField({ label, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-xs text-red-500"
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  else if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
  if (!form.category) errors.category = 'Please select a category'
  if (!form.status) errors.status = 'Please select a status'
  if (!form.date) errors.date = 'Date is required'
  if (form.description && form.description.length > 300) errors.description = 'Max 300 characters'
  return errors
}

export default function RecordForm({ onSubmit, initialData = null, submitLabel = 'Save Record' }) {
  const [form, setForm] = useState(initialData ? { ...defaultForm, ...initialData } : { ...defaultForm })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      setErrors(prev => {
        const v = validate({ ...form, [field]: value })
        return { ...prev, [field]: v[field] }
      })
    }
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const v = validate(form)
    setErrors(prev => ({ ...prev, [field]: v[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = Object.keys(defaultForm).reduce((a, k) => ({ ...a, [k]: true }), {})
    setTouched(allTouched)
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    onSubmit(form)
    setLoading(false)
    if (!initialData) {
      setForm({ ...defaultForm })
      setTouched({})
      setErrors({})
    }
  }

  const handleReset = () => {
    setForm(initialData ? { ...defaultForm, ...initialData } : { ...defaultForm })
    setErrors({})
    setTouched({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        {/* Name */}
        <FloatingField label="Full Name" error={touched.name && errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="e.g. Alice Johnson"
            className={`input-field ${touched.name && errors.name ? 'border-red-400 focus:ring-red-400/30' : ''}`}
          />
        </FloatingField>

        {/* Category */}
        <FloatingField label="Category" error={touched.category && errors.category}>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            onBlur={() => handleBlur('category')}
            className={`input-field ${touched.category && errors.category ? 'border-red-400 focus:ring-red-400/30' : ''}
                       ${!form.category ? 'text-gray-400' : ''}`}
          >
            <option value="" disabled>Select category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </FloatingField>

        {/* Status */}
        <FloatingField label="Status" error={touched.status && errors.status}>
          <div className="flex gap-2">
            {STATUSES.map(s => (
              <motion.button
                key={s}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => { set('status', s); handleBlur('status') }}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all duration-200
                  ${form.status === s
                    ? s === 'Active'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                      : s === 'Pending'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20'
                      : 'bg-gray-700 text-white border-gray-700'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                  }`}
              >
                {s}
              </motion.button>
            ))}
          </div>
          {touched.status && errors.status && (
            <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
              <AlertCircle size={11} />{errors.status}
            </p>
          )}
        </FloatingField>

        {/* Date */}
        <FloatingField label="Date" error={touched.date && errors.date}>
          <input
            type="date"
            value={form.date}
            onChange={e => set('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            className={`input-field ${touched.date && errors.date ? 'border-red-400 focus:ring-red-400/30' : ''}`}
          />
        </FloatingField>
      </div>

      {/* Description */}
      <FloatingField label="Description" error={touched.description && errors.description}>
        <div className="relative">
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder="Add notes or details (optional, max 300 chars)"
            rows={3}
            className={`input-field resize-none ${touched.description && errors.description ? 'border-red-400' : ''}`}
          />
          <span className={`absolute bottom-3 right-3 text-xs font-mono
            ${form.description.length > 280 ? 'text-red-400' : 'text-gray-300 dark:text-gray-600'}`}>
            {form.description.length}/300
          </span>
        </div>
      </FloatingField>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {loading ? 'Saving...' : submitLabel}
        </motion.button>

        <motion.button
          type="button"
          onClick={handleReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw size={14} /> Reset
        </motion.button>
      </div>
    </form>
  )
}

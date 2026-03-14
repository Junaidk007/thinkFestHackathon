import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useRecords } from '../hooks/useRecords'
import RecordForm from '../components/RecordForm'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function AddRecord() {
  const { addRecord } = useRecords()
  const navigate = useNavigate()

  const handleSubmit = (data) => {
    addRecord(data)
    toast.success('Record added successfully!', {
      icon: '✨',
      style: { background: '#111', color: '#fff' },
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                     transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-accent-50 dark:bg-accent-900/20 rounded-xl flex items-center justify-center">
            <Sparkles size={16} className="text-accent-500" />
          </div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Add New Record</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Fill in the details below to add a new record to the system.
        </p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm"
      >
        <RecordForm onSubmit={handleSubmit} submitLabel="Add Record" />
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-accent-50 dark:bg-accent-900/10 border border-accent-100 dark:border-accent-800/30 rounded-2xl p-4"
      >
        <p className="text-xs font-medium text-accent-700 dark:text-accent-400 mb-2">💡 Quick Tips</p>
        <ul className="text-xs text-accent-600 dark:text-accent-500 space-y-1">
          <li>· Name field must be at least 2 characters</li>
          <li>· Description is optional but helps with searching</li>
          <li>· Use categories consistently for better analytics</li>
          <li>· Records are saved instantly to local storage</li>
        </ul>
      </motion.div>
    </div>
  )
}

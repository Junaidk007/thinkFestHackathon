import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import RecordForm from './RecordForm'

export default function EditModal({ record, onSave, onClose }) {
  if (!record) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800
                     shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="font-display font-semibold text-gray-900 dark:text-white">Edit Record</h2>
              <p className="text-xs text-gray-400 mt-0.5">Update the fields below and save changes</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400
                         hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-6">
            <RecordForm
              initialData={record}
              submitLabel="Save Changes"
              onSubmit={(data) => {
                onSave(record.id, data)
                onClose()
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

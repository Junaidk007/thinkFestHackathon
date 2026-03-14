import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Table2, PlusCircle } from 'lucide-react'
import { useRecords } from '../hooks/useRecords'
import RecordTable from '../components/RecordTable'
import EditModal from '../components/EditModal'
import ConfirmModal from '../components/ConfirmModal'

export default function ManageRecords() {
  const { records, updateRecord, deleteRecord } = useRecords()
  const navigate = useNavigate()

  const [editRecord, setEditRecord] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleSave = (id, data) => {
    updateRecord(id, data)
    toast.success('Record updated!', { icon: '✅' })
  }

  const handleDelete = () => {
    deleteRecord(deleteTarget.id)
    toast.error(`"${deleteTarget.name}" deleted`, { icon: '🗑️' })
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
            <Table2 size={16} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Manage Records</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{records.length} total records</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard/add')}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle size={16} /> Add Record
        </motion.button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <RecordTable
          records={records}
          onEdit={setEditRecord}
          onDelete={setDeleteTarget}
        />
      </motion.div>

      {/* Edit Modal */}
      {editRecord && (
        <EditModal
          record={editRecord}
          onSave={handleSave}
          onClose={() => setEditRecord(null)}
        />
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Record"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}

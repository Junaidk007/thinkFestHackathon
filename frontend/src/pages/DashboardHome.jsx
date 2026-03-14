import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, ArrowRight, Clock } from 'lucide-react'
import { useRecords } from '../hooks/useRecords'
import SummaryCards from '../components/SummaryCards'
import StatusBadge from '../components/StatusBadge'

export default function DashboardHome() {
  const { records } = useRecords()
  const navigate = useNavigate()
  const recent = records.slice(0, 5)

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1"
          >
            Overview
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display font-bold text-2xl text-gray-900 dark:text-white"
          >
            {greeting}, Dev 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-gray-500 dark:text-gray-400 mt-1"
          >
            Here's what's happening with your records today.
          </motion.p>
        </div>
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard/add')}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle size={16} /> Add Record
        </motion.button>
      </div>

      {/* Summary Cards */}
      <SummaryCards records={records} />

      {/* Two column section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Records */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-gray-400" />
              <h2 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Recent Records</h2>
            </div>
            <button
              onClick={() => navigate('/dashboard/records')}
              className="text-xs text-accent-500 hover:text-accent-600 font-medium flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recent.map((record, i) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center
                               flex-shrink-0 font-display font-bold text-xs text-gray-600 dark:text-gray-400">
                  {record.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{record.name}</p>
                  <p className="text-xs text-gray-400">{record.category} · {record.date}</p>
                </div>
                <StatusBadge status={record.status} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-display font-semibold text-gray-900 dark:text-white text-sm">By Category</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            {Object.entries(
              records.reduce((acc, r) => {
                acc[r.category] = (acc[r.category] || 0) + 1
                return acc
              }, {})
            )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([cat, count], i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">{cat}</span>
                    <span className="text-xs font-mono text-gray-400">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / records.length) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: 'easeOut' }}
                      className="h-full bg-accent-400 dark:bg-accent-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

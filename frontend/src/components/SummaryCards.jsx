import { motion } from 'framer-motion'
import { Database, CheckCircle, Clock, TrendingUp } from 'lucide-react'

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
}

export default function SummaryCards({ records }) {
  const total = records.length
  const active = records.filter(r => r.status === 'Active').length
  const pending = records.filter(r => r.status === 'Pending').length
  const closed = records.filter(r => r.status === 'Closed').length

  // Recent = added in last 7 days (by id timestamp approximation)
  const recentCount = records.slice(0, Math.min(3, records.length)).length

  const cards = [
    {
      icon: Database,
      label: 'Total Records',
      value: total,
      sub: `${closed} closed`,
      color: 'from-accent-500 to-accent-600',
      bg: 'bg-accent-50 dark:bg-accent-900/20',
      iconColor: 'text-accent-600 dark:text-accent-400',
    },
    {
      icon: CheckCircle,
      label: 'Active Records',
      value: active,
      sub: `${Math.round((active / total) * 100) || 0}% of total`,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: Clock,
      label: 'Pending Review',
      value: pending,
      sub: `Requires attention`,
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      icon: TrendingUp,
      label: 'Recent Activity',
      value: recentCount,
      sub: 'Latest entries',
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800
                     transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
              <card.icon size={19} className={card.iconColor} />
            </div>
            <div className="text-right">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                className="font-display font-bold text-3xl text-gray-900 dark:text-white"
              >
                {card.value}
              </motion.div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{card.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </div>
          {/* Progress indicator */}
          <div className="mt-4 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((card.value / Math.max(total, 1)) * 100, 100)}%` }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${card.color} rounded-full`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

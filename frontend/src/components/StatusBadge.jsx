export default function StatusBadge({ status }) {
  const config = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    Closed: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  }
  const dot = {
    Active: 'bg-emerald-500',
    Pending: 'bg-amber-500',
    Closed: 'bg-gray-400',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config[status] || config.Closed}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || dot.Closed}`} />
      {status}
    </span>
  )
}

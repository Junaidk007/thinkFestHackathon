import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { useRecords } from '../hooks/useRecords'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16']

const STATUS_COLORS = {
  Active: '#10b981',
  Pending: '#f59e0b',
  Closed: '#6b7280',
}

function ChartCard({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
    >
      <div className="mb-5">
        <h3 className="font-display font-semibold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 shadow-xl text-xs">
      {label && <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || entry.fill }}>
          {entry.name}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function Analytics() {
  const { records } = useRecords()

  const byCategory = useMemo(() => {
    const counts = {}
    records.forEach(r => { counts[r.category] = (counts[r.category] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [records])

  const byStatus = useMemo(() => {
    const counts = {}
    records.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [records])

  const overTime = useMemo(() => {
    const counts = {}
    records.forEach(r => {
      const month = r.date ? r.date.slice(0, 7) : 'Unknown'
      counts[month] = (counts[month] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({
        month: month === 'Unknown' ? month : new Date(month + '-01').toLocaleDateString('en', { month: 'short', year: '2-digit' }),
        count
      }))
  }, [records])

  const byCategoryAndStatus = useMemo(() => {
    const result = {}
    records.forEach(r => {
      if (!result[r.category]) result[r.category] = { name: r.category, Active: 0, Pending: 0, Closed: 0 }
      result[r.category][r.status] = (result[r.category][r.status] || 0) + 1
    })
    return Object.values(result).sort((a, b) => (b.Active + b.Pending + b.Closed) - (a.Active + a.Pending + a.Closed))
  }, [records])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
          <BarChart3 size={16} className="text-purple-500" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Insights across {records.length} records</p>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Records by Category */}
        <ChartCard title="Records by Category" subtitle="Distribution across all categories">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byCategory} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Records" radius={[6, 6, 0, 0]}>
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Records by Status (Pie) */}
        <ChartCard title="Records by Status" subtitle="Current distribution of record statuses">
          <div className="flex items-center justify-between gap-6">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={byStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {byStatus.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {byStatus.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                       style={{ background: STATUS_COLORS[entry.name] || COLORS[i] }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">{entry.name}</span>
                  <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Over Time */}
        <ChartCard title="Records Over Time" subtitle="Monthly record count trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={overTime} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                name="Records"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Stacked by Category & Status */}
        <ChartCard title="Status by Category" subtitle="Stacked breakdown of statuses per category">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byCategoryAndStatus} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
              <Bar dataKey="Active" stackId="a" fill={STATUS_COLORS.Active} radius={[0, 0, 0, 0]} name="Active" />
              <Bar dataKey="Pending" stackId="a" fill={STATUS_COLORS.Pending} name="Pending" />
              <Bar dataKey="Closed" stackId="a" fill={STATUS_COLORS.Closed} radius={[4, 4, 0, 0]} name="Closed" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

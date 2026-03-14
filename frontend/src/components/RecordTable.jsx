import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import StatusBadge from './StatusBadge'

const CATEGORIES = ['All', 'Research', 'Operations', 'Finance', 'HR', 'Technology', 'Marketing', 'Legal', 'Other']
const STATUSES = ['All', 'Active', 'Pending', 'Closed']
const PAGE_SIZE = 7

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <ChevronsUpDown size={13} className="text-gray-300 dark:text-gray-600" />
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-accent-500" />
    : <ChevronDown size={13} className="text-accent-500" />
}

function Highlight({ text, query }) {
  if (!query) return <>{text}</>
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-accent-100 dark:bg-accent-900/40 text-accent-700 dark:text-accent-300 rounded px-0.5">{part}</mark>
          : part
      )}
    </>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50 dark:border-gray-800">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 shimmer-bg rounded w-3/4" />
        </td>
      ))}
    </tr>
  )
}

export default function RecordTable({ records, onEdit, onDelete, loading = false }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [sortField, setSortField] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
    setPage(1)
  }

  const filtered = useMemo(() => {
    let data = records
    if (search) data = data.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
    )
    if (category !== 'All') data = data.filter(r => r.category === category)
    if (status !== 'All') data = data.filter(r => r.status === status)

    data = [...data].sort((a, b) => {
      let va = a[sortField] || ''
      let vb = b[sortField] || ''
      if (sortDir === 'asc') return va > vb ? 1 : -1
      return va < vb ? 1 : -1
    })
    return data
  }, [records, search, category, status, sortField, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const cols = [
    { field: 'name', label: 'Name' },
    { field: 'category', label: 'Category' },
    { field: 'status', label: 'Status' },
    { field: 'date', label: 'Date' },
  ]

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, category, or description..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="input-field pl-9"
          />
        </div>
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1) }}
          className="input-field w-auto min-w-[130px]"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="input-field w-auto min-w-[110px]"
        >
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 font-mono">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          {(search || category !== 'All' || status !== 'All') ? ' (filtered)' : ''}
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Filter size={11} />
          {category !== 'All' && <span className="bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 px-2 py-0.5 rounded-full">{category}</span>}
          {status !== 'All' && <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{status}</span>}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {cols.map(col => (
                  <th
                    key={col.field}
                    onClick={() => handleSort(col.field)}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400
                               uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200
                               select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon field={col.field} sortField={sortField} sortDir={sortDir} />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                : paged.length === 0
                ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                          <Search size={22} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-sm text-gray-400">No records found</p>
                        <p className="text-xs text-gray-300 dark:text-gray-600">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )
                : paged.map((record, i) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30
                               transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        <Highlight text={record.name} query={search} />
                      </span>
                      {record.description && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{record.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        <Highlight text={record.category} query={search} />
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-mono text-xs">{record.date}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => onEdit(record)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     text-gray-400 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20
                                     transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => onDelete(record)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                                     transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">
              Page {page} of {totalPages} · {filtered.length} records
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
                           hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800
                           disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                    ${page === i + 1
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
                           hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800
                           disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Sun, Moon, Trash2, Download, RefreshCw, Palette } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useRecords } from '../hooks/useRecords'
import toast from 'react-hot-toast'

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="font-display font-semibold text-sm text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">{children}</div>
    </div>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

const THEMES = [
  { name: 'Blue', accent: '#3b82f6' },
  { name: 'Violet', accent: '#8b5cf6' },
  { name: 'Emerald', accent: '#10b981' },
  { name: 'Rose', accent: '#f43f5e' },
  { name: 'Amber', accent: '#f59e0b' },
]

export default function Settings() {
  const { dark, setDark } = useTheme()
  const { records } = useRecords()
  const [systemName, setSystemName] = useState(() => localStorage.getItem('nexus-system-name') || 'Nexus')
  const [selectedTheme, setSelectedTheme] = useState(0)

  const handleNameSave = () => {
    localStorage.setItem('nexus-system-name', systemName)
    toast.success('System name updated!')
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nexus-records-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    toast.success('Records exported!')
  }

  const handleClear = () => {
    if (confirm('This will delete ALL records. Are you sure?')) {
      localStorage.removeItem('nexus-records')
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
          <SettingsIcon size={16} className="text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customize your Nexus experience</p>
        </div>
      </div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Section title="Appearance">
          <SettingRow
            label="Color Mode"
            desc="Switch between light and dark interface"
          >
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setDark(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${!dark ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
              >
                <Sun size={13} /> Light
              </button>
              <button
                onClick={() => setDark(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${dark ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
              >
                <Moon size={13} /> Dark
              </button>
            </div>
          </SettingRow>

          <SettingRow label="Accent Color" desc="Choose your preferred accent color">
            <div className="flex gap-2">
              {THEMES.map((t, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setSelectedTheme(i); toast.success(`${t.name} accent selected!`) }}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${selectedTheme === i ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                  style={{ background: t.accent }}
                  title={t.name}
                />
              ))}
            </div>
          </SettingRow>
        </Section>
      </motion.div>

      {/* Platform */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section title="Platform">
          <SettingRow label="System Name" desc="Rename this platform for your use case">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={systemName}
                onChange={e => setSystemName(e.target.value)}
                className="input-field w-36 text-sm py-2"
                placeholder="Nexus"
              />
              <button onClick={handleNameSave} className="btn-primary text-xs py-2 px-3">Save</button>
            </div>
          </SettingRow>
        </Section>
      </motion.div>

      {/* Data */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section title="Data Management">
          <SettingRow label="Export Records" desc={`Download all ${records.length} records as JSON`}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              className="btn-secondary flex items-center gap-2 text-xs py-2"
            >
              <Download size={13} /> Export
            </motion.button>
          </SettingRow>

          <SettingRow label="Reset Data" desc="Reload the app with fresh seed data">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { localStorage.removeItem('nexus-records'); window.location.reload() }}
              className="btn-secondary flex items-center gap-2 text-xs py-2"
            >
              <RefreshCw size={13} /> Reset
            </motion.button>
          </SettingRow>

          <SettingRow
            label="Clear All Records"
            desc="Permanently delete all records — cannot be undone"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleClear}
              className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30
                         px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 hover:bg-red-100 transition-colors"
            >
              <Trash2 size={13} /> Clear All
            </motion.button>
          </SettingRow>
        </Section>
      </motion.div>

      {/* About */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Section title="About">
          <SettingRow label="Platform" desc="Universal Management Dashboard">
            <span className="text-xs font-mono text-gray-400">Nexus v1.0.0</span>
          </SettingRow>
          <SettingRow label="Built for" desc="IBM ThinkFest 2026 Hackathon">
            <span className="text-xs font-mono text-accent-500">hackathon-ready</span>
          </SettingRow>
          <SettingRow label="Tech Stack" desc="React + Vite + Tailwind + Framer Motion + Recharts">
            <span className="text-xs font-mono text-gray-400">MIT License</span>
          </SettingRow>
        </Section>
      </motion.div>
    </div>
  )
}

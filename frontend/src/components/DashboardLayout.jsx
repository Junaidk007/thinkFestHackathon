import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, PlusCircle, Table2, BarChart3, Settings,
  Menu, X, Bell, Search, Sun, Moon, LogOut, User
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: PlusCircle, label: 'Add Record', to: '/dashboard/add' },
  { icon: Table2, label: 'Manage Records', to: '/dashboard/records' },
  { icon: BarChart3, label: 'Analytics', to: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', to: '/dashboard/settings' },
]

function ThemeToggle() {
  const { dark, setDark } = useTheme()
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setDark(!dark)}
      className="w-9 h-9 rounded-xl flex items-center justify-center
                 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={dark ? 'moon' : 'sun'}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -280 }}
        className={`fixed lg:static top-0 left-0 h-full w-64 z-30 bg-white dark:bg-gray-900
                    border-r border-gray-100 dark:border-gray-800 flex flex-col py-6 px-4
                    transition-transform lg:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-gray-900 text-xs font-bold font-display">N</span>
            </div>
            <span className="font-display font-bold text-gray-900 dark:text-white text-lg">Hakla</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest px-3 mb-3">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-purple-500
                            flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              D
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Dev User</p>
              <p className="text-xs text-gray-400 truncate">Admin</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="sidebar-link w-full mt-1 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            <LogOut size={16} />
            <span>Exit Dashboard</span>
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
                           border-b border-gray-100 dark:border-gray-800 px-4 md:px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl
                       hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700
                           rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-gray-100
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30
                           transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center relative
                               text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-500 rounded-full" />
            </button>
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-purple-500
                            flex items-center justify-center text-white text-xs font-bold ml-1">
              D
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

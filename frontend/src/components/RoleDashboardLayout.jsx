import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, LogOut, CarFront } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

function ThemeSwitch() {
  const { dark, setDark } = useTheme()
  return (
    <button
      onClick={() => setDark(!dark)}
      className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300"
      title="Toggle theme"
    >
      {dark ? 'L' : 'D'}
    </button>
  )
}

export default function RoleDashboardLayout({ title, navItems }) {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <AnimatePresence>
        {open && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static top-0 left-0 z-30 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-5 transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 grid place-items-center">
              <CarFront size={14} />
            </div>
            <div>
              <p className="font-display font-bold text-gray-900 dark:text-white">Campus Parking</p>
              <p className="text-xs text-gray-400">{title}</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-500">
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-4">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{user?.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="mt-3 sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <section className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-white/85 dark:bg-gray-900/85 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
          <button onClick={() => setOpen(!open)} className="lg:hidden text-gray-500">
            <Menu size={20} />
          </button>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Role Dashboard</p>
            <h1 className="font-display font-semibold text-gray-900 dark:text-white">{title}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="w-9 h-9 grid place-items-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500">
              <Bell size={16} />
            </button>
            <ThemeSwitch />
          </div>
        </header>

        <main className="p-4 md:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </section>
    </div>
  )
}

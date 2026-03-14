import { useRef, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float, Sphere, Box, Torus } from '@react-three/drei'
import {
  ArrowRight, Zap, Shield, BarChart3, Database,
  Users, Globe, ChevronRight, Star, CheckCircle
} from 'lucide-react'

function FloatingShape({ position, color, shape = 'sphere', scale = 1 }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {shape === 'sphere' && <sphereGeometry args={[1, 32, 32]} />}
        {shape === 'box' && <boxGeometry args={[1.4, 1.4, 1.4]} />}
        {shape === 'torus' && <torusGeometry args={[1, 0.35, 16, 100]} />}
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.15}
          distort={0.3}
          speed={2}
          roughness={0}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} color="#60a5fa" intensity={1} />
      <FloatingShape position={[3.5, 1, -3]} color="#3b82f6" shape="sphere" scale={2} />
      <FloatingShape position={[-4, -1, -2]} color="#8b5cf6" shape="torus" scale={1.5} />
      <FloatingShape position={[0, 3, -5]} color="#06b6d4" shape="box" scale={1.2} />
      <FloatingShape position={[-2.5, 2, -4]} color="#10b981" shape="sphere" scale={0.8} />
      <FloatingShape position={[4, -2, -3]} color="#f59e0b" shape="torus" scale={0.9} />
    </>
  )
}

const features = [
  { icon: Database, title: 'Universal CRUD', desc: 'Create, read, update, delete records with instant persistence and real-time sync.' },
  { icon: BarChart3, title: 'Live Analytics', desc: 'Interactive charts and visual dashboards to track performance at a glance.' },
  { icon: Shield, title: 'Data Integrity', desc: 'Form validation and confirmation flows ensure clean, reliable data at all times.' },
  { icon: Zap, title: 'Instant Response', desc: 'Lightning-fast operations with optimistic updates and smooth micro-interactions.' },
  { icon: Users, title: 'Multi-category', desc: 'Organize records by custom categories — Research, Finance, HR, Operations and beyond.' },
  { icon: Globe, title: 'Fully Responsive', desc: 'Pixel-perfect experience across desktop, tablet, and mobile devices.' },
]

const howItWorks = [
  { step: '01', title: 'Enter the Platform', desc: 'Access the dashboard from anywhere — no sign-up needed, instant access.' },
  { step: '02', title: 'Add Your Records', desc: 'Fill in the universal form to log entries with name, category, status, and notes.' },
  { step: '03', title: 'Manage Everything', desc: 'Search, filter, sort, edit, and delete records from the management table.' },
  { step: '04', title: 'Analyze & Decide', desc: 'View category breakdowns, status distributions, and time-series trends.' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function LandingPage() {
  const navigate = useNavigate()
  const heroRef = useRef()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5
                      bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
            <span className="text-white dark:text-gray-900 text-xs font-bold font-display">N</span>
          </div>
          <span className="font-display font-bold text-lg text-gray-900 dark:text-white">Nexus</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400 font-medium">
          <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-gray-900 dark:hover:text-white transition-colors">How it works</a>
          <a href="#platform" className="hover:text-gray-900 dark:hover:text-white transition-colors">Platform</a>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard')}
          className="btn-primary flex items-center gap-2 text-xs"
        >
          Enter Dashboard <ArrowRight size={14} />
        </motion.button>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
              <Scene />
            </Canvas>
          </Suspense>
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                       rounded-full px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-8 shadow-sm"
          >
            <Star size={12} className="text-amber-400 fill-amber-400" />
            Hackathon-ready universal management platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-bold text-6xl md:text-8xl text-gray-900 dark:text-white leading-[1.05] mb-6"
          >
            Manage anything.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-purple-500">
              Ship instantly.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A universal dashboard template that adapts to any domain — libraries, pharmacies, events, inventory, and beyond. Built for speed, designed for clarity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl
                         font-semibold text-base flex items-center gap-3 shadow-xl"
            >
              Enter Dashboard <ArrowRight size={18} />
            </motion.button>
            <a href="#features"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                         font-medium text-sm flex items-center gap-2 transition-colors">
              See what's inside <ChevronRight size={16} />
            </a>
          </motion.div>

          {/* Dashboard preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-20 relative"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800
                            shadow-2xl overflow-hidden max-w-4xl mx-auto">
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <div className="ml-4 bg-white dark:bg-gray-700 rounded-md px-12 py-1 text-xs text-gray-400">
                  nexus.app/dashboard
                </div>
              </div>
              <div className="flex h-48 md:h-64">
                <div className="w-48 bg-gray-50 dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 p-4">
                  {['Dashboard', 'Add Record', 'Manage', 'Analytics', 'Settings'].map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-1 text-xs
                      ${i === 0 ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium' : 'text-gray-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-300'}`} />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-6">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[['24', 'Total Records'], ['18', 'Active'], ['6', 'Pending']].map(([num, label], i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                        <div className="text-xl font-display font-bold text-gray-900 dark:text-white">{num}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-end gap-1 h-16">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-accent-400 dark:bg-accent-500 rounded-sm"
                           style={{ height: `${h}%`, opacity: 0.5 + i * 0.07 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent pointer-events-none rounded-2xl" />
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="text-xs font-mono text-accent-500 tracking-widest uppercase mb-4">Capabilities</div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">
              Everything you need.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Built with the right primitives to ship fast and look great doing it.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800
                           transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4
                               group-hover:bg-accent-50 dark:group-hover:bg-accent-900/20 transition-colors">
                  <f.icon size={20} className="text-gray-700 dark:text-gray-300 group-hover:text-accent-500 transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PLATFORM CAPABILITIES */}
      <section id="platform" className="py-24 px-6 bg-gray-900 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <div className="text-xs font-mono text-accent-400 tracking-widest uppercase mb-4">Platform</div>
              <h2 className="font-display font-bold text-4xl text-white mb-6">
                Adapt it to any management problem.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Nexus is purpose-built as a rebranding scaffold. Change the title, swap the categories, and you have a Library System, Pharmacy Dashboard, Student Records portal, or Inventory Manager — in minutes.
              </p>
              {[
                'LocalStorage-powered CRUD',
                'Recharts analytics integration',
                'Framer Motion page transitions',
                'Light & Dark mode',
                'Form validation built-in',
                'Mobile-responsive sidebar',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <CheckCircle size={16} className="text-accent-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Library System', color: 'from-blue-500/20 to-blue-600/5' },
                { label: 'Pharmacy Mgmt', color: 'from-green-500/20 to-green-600/5' },
                { label: 'Student Records', color: 'from-purple-500/20 to-purple-600/5' },
                { label: 'Inventory Track', color: 'from-amber-500/20 to-amber-600/5' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  className={`bg-gradient-to-br ${item.color} border border-white/10 rounded-2xl p-6 cursor-default`}
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg mb-4" />
                  <p className="text-white font-medium text-sm">{item.label}</p>
                  <p className="text-gray-500 text-xs mt-1">Ready to use</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="text-xs font-mono text-accent-500 tracking-widest uppercase mb-4">Workflow</div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900 dark:text-white">
              How it works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="text-center"
              >
                <div className="font-display font-bold text-5xl text-gray-100 dark:text-gray-800 mb-4">{step.step}</div>
                <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 dark:bg-white rounded-3xl p-16"
          >
            <h2 className="font-display font-bold text-4xl text-white dark:text-gray-900 mb-4">
              Ready to build?
            </h2>
            <p className="text-gray-400 dark:text-gray-600 mb-8">
              Jump into the dashboard and start managing records instantly.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/dashboard')}
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-10 py-4 rounded-xl
                         font-semibold text-base inline-flex items-center gap-3 shadow-xl"
            >
              Launch Dashboard <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-900 dark:bg-white rounded-md flex items-center justify-center">
              <span className="text-white dark:text-gray-900 text-xs font-bold font-display">N</span>
            </div>
            <span className="font-display font-semibold text-gray-900 dark:text-white">Nexus</span>
          </div>
          <p className="text-gray-400 text-sm">
            Universal Management Platform · Built for IBM ThinkFest 2026
          </p>
          <p className="text-gray-400 text-xs font-mono">v1.0.0</p>
        </div>
      </footer>
    </div>
  )
}

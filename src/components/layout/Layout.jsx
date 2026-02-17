import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../components/theme/ThemeContext';
import {
  FiHome, FiCreditCard, FiTrendingUp, FiTarget,
  FiBarChart2, FiLogOut, FiMenu, FiX, FiMessageSquare,
  FiSun, FiMoon,
} from 'react-icons/fi';
import Footer from '../footer/Footer';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Accounts', href: '/accounts', icon: FiCreditCard },
  { name: 'Transactions', href: '/transactions', icon: FiTrendingUp },
  { name: 'Budgets', href: '/budgets', icon: FiTarget },
  { name: 'Analytics', href: '/analytics', icon: FiBarChart2 },
  { name: 'AI Advisor', href: '/ai-advisor', icon: FiMessageSquare },
];

const navItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.3 } }),
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 flex flex-col
        bg-white dark:bg-gray-900
        border-r border-slate-100 dark:border-gray-800
        shadow-sm transition-colors duration-300
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-300 lg:transition-none
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #c026d3)' }}>
              FF
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg">FinanceFlow</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {navigation.map((item, i) => {
            const active = isActive(item.href);
            return (
              <motion.div key={item.name} custom={i} initial="hidden" animate="visible" variants={navItemVariants}>
                <Link
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${active
                      ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white'
                    }
                  `}
                >
                  <item.icon
                    className={`flex-shrink-0 ${active ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`}
                    style={{ width: '18px', height: '18px' }}
                  />
                  {item.name}
                  {active && (
                    <motion.div layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #c026d3)' }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Dark mode toggle + User section */}
        <div className="p-3 border-t border-slate-100 dark:border-gray-800 space-y-1">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
          >
            {isDark
              ? <FiSun className="w-4 h-4 text-amber-400" />
              : <FiMoon className="w-4 h-4 text-slate-400" />
            }
            {isDark ? 'Light mode' : 'Dark mode'}
            <div className={`ml-auto w-9 h-5 rounded-full transition-colors duration-300 relative ${isDark ? 'bg-violet-600' : 'bg-slate-200'}`}>
              <motion.div
                animate={{ x: isDark ? 16 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </div>
          </button>

          {/* User */}
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-violet-700 dark:text-violet-300 text-xs flex-shrink-0"
              style={{ background: isDark ? 'rgba(124,58,237,0.2)' : '#ede9fe' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {greeting()}, {user?.fullName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between h-14 px-4 bg-white dark:bg-gray-900 border-b border-slate-100 dark:border-gray-800 sticky top-0 z-10 transition-colors duration-300">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-white text-xs"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #c026d3)' }}>
              FF
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">FinanceFlow</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isDark ? <FiSun className="w-4 h-4 text-amber-400" /> : <FiMoon className="w-4 h-4" />}
          </button>
        </div>

        {/* Page content */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 p-6"
        >
          {children}
        </motion.main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LayoutDashboard, Users, LogOut, Sun, Moon, Menu } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Smart Leads
          </span>
        </div>
        <nav className="p-4 space-y-1">
          <Link
            to="/"
            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          {/* Add more links here if needed */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="flex items-center">
            <button 
              className="p-2 mr-4 text-gray-500 dark:text-gray-400 lg:hidden rounded-md focus:outline-none focus:ring"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white hidden sm:block">
              Leads Management
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold mr-2">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-sm mr-4">
                <p className="text-gray-700 dark:text-gray-200 font-medium">{user.name}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{user.role}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

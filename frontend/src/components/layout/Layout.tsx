import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LayoutDashboard, LogOut, Sun, Moon, Menu, X, ChevronLeft, Zap } from 'lucide-react';
import api from '../../api/client';
import '../../App.css';

export default function Layout() {
  const { user, login, logout } = useAuthStore();
  const location = useLocation();
  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(!user);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    sessionStorage.setItem('loggedOut', 'true');
    logout();
  };

  useEffect(() => {
    const isLoggedOut = sessionStorage.getItem('loggedOut') === 'true';
    if (!user && !isLoggedOut) {
      // Silently auto-login as guest
      const autoLogin = async () => {
        try {
          const { data } = await api.post('/auth/guest');
          login(data, data.token);
        } catch (err) {
          console.error("Auto guest login failed:", err);
          setIsAutoLoggingIn(false);
        }
      };
      autoLogin();
    } else {
      setIsAutoLoggingIn(false);
    }
  }, [user, login]);

  if (!user && sessionStorage.getItem('loggedOut') === 'true') {
    return <Navigate to="/login" replace />;
  }

  if (isAutoLoggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700/50 shadow-sm flex flex-col transition-all duration-300 ease-in-out lg:static lg:z-auto
          ${sidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-60'}
          ${sidebarOpen ? 'translate-x-0 w-60' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200/60 dark:border-gray-700/50">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-gray-950 dark:text-white tracking-tight">SmartLeads</span>
            )}
          </Link>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                  ${isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-950 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-md">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button (Desktop) */}
        <div className="p-4 border-t border-gray-200/60 dark:border-gray-700/50 hidden lg:block">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200/40 dark:border-gray-700/30"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 glass border-b border-gray-200/60 dark:border-gray-700/50">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl lg:hidden transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                title="Sign out"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

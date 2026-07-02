'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useAuthStore } from '@/lib/auth-store';
import { hasPermission } from '@/lib/rbac';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, reset } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      reset();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Panel', icon: '📊', permission: 'view_dashboard' },
    { href: '/companies', label: 'Empresas', icon: '🏢', permission: 'manage_company' },
    { href: '/users', label: 'Usuarios', icon: '👥', permission: 'manage_users' },
    { href: '/vehicles', label: 'Vehículos', icon: '🚗', permission: 'manage_vehicles' },
    { href: '/settings', label: 'Configuración', icon: '⚙️', permission: 'manage_settings' },
  ];

  const filteredNavItems = navItems.filter((item) => hasPermission(user?.rol, item.permission));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gray-800 border-r border-gray-700 transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-2xl font-bold text-blue-500">LuCar</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-800">
          <Link
            href="/profile"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.nombre}</p>
                <p className="text-xs text-gray-400 truncate">{user?.rol}</p>
              </div>
            )}
          </Link>

          {sidebarOpen && (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg transition-colors text-sm font-medium"
            >
              {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">LuCar Fleet</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user?.nombre}</span>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

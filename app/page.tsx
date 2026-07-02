'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-500">LuCar Fleet</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary">Registrarse</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Gestiona tu Flota Vehicular
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          LuCar Fleet es la solución integral para administrar vehículos, usuarios y empresas en un único sistema.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button variant="primary" size="lg">
              Comenzar Ahora
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Características Principales</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-colors">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-bold mb-3">Multi-Empresa</h3>
            <p className="text-gray-400">
              Gestiona múltiples empresas con aislamiento de datos completo y seguridad garantizada.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-colors">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-3">Gestión de Usuarios</h3>
            <p className="text-gray-400">
              Controla accesos con roles: Propietario, Administrador, Supervisor y Operador.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-colors">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-bold mb-3">CRUD de Vehículos</h3>
            <p className="text-gray-400">
              Crea, lee, actualiza y elimina vehículos con información completa y estado en tiempo real.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-colors">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3">Dashboard en Tiempo Real</h3>
            <p className="text-gray-400">
              Visualiza métricas importantes: vehículos activos, usuarios, planes y más.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-colors">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-3">Seguridad Avanzada</h3>
            <p className="text-gray-400">
              Autenticación Firebase, Firestore Security Rules y aislamiento de datos por tenant.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-colors">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-3">Interfaz Responsiva</h3>
            <p className="text-gray-400">
              Diseño profesional en modo oscuro, completamente responsive para todos los dispositivos.
            </p>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Planes Disponibles</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Essential */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-2">Essential</h3>
            <p className="text-gray-400 mb-6">Perfecto para pequeñas empresas</p>
            <div className="text-3xl font-bold mb-6">10 <span className="text-lg text-gray-400">vehículos</span></div>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Gestión básica de vehículos</li>
              <li>✓ Hasta 5 usuarios</li>
              <li>✓ Dashboard simple</li>
              <li>✓ Soporte por email</li>
            </ul>
            <Button variant="primary" className="w-full">
              Seleccionar
            </Button>
          </div>

          {/* Professional */}
          <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-8 relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg text-sm font-bold">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2">Professional</h3>
            <p className="text-gray-400 mb-6">Para empresas en crecimiento</p>
            <div className="text-3xl font-bold mb-6">50 <span className="text-lg text-gray-400">vehículos</span></div>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Gestión avanzada de vehículos</li>
              <li>✓ Hasta 20 usuarios</li>
              <li>✓ Dashboard completo</li>
              <li>✓ Reportes básicos</li>
              <li>✓ Soporte prioritario</li>
            </ul>
            <Button variant="primary" className="w-full">
              Seleccionar
            </Button>
          </div>

          {/* Enterprise */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-gray-400 mb-6">Para grandes operaciones</p>
            <div className="text-3xl font-bold mb-6">500 <span className="text-lg text-gray-400">vehículos</span></div>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Gestión ilimitada</li>
              <li>✓ Usuarios ilimitados</li>
              <li>✓ Reportes avanzados</li>
              <li>✓ API access</li>
              <li>✓ Soporte 24/7 dedicado</li>
            </ul>
            <Button variant="primary" className="w-full">
              Contactar Ventas
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">¿Listo para comenzar?</h2>
        <p className="text-xl text-gray-400 mb-8">
          Crea tu cuenta hoy y comienza a gestionar tu flota vehicular de forma eficiente.
        </p>
        <Link href="/register">
          <Button variant="primary" size="lg">
            Registrarse Ahora
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2026 LuCar Fleet. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

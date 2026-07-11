'use client';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-mesh">
      {/* Navigation */}
      <nav className="glass border-b border-white/[0.06] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">LuCar Fleet</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Comenzar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Plataforma de gestión de flotas
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
          <span className="gradient-text">Gestiona tu flota</span>
          <br />
          <span className="text-white">con inteligencia</span>
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          LuCar Fleet es la plataforma integral para administrar vehículos, rastreo GPS, 
          usuarios y operaciones en un único sistema profesional.
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
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Características Principales</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Todo lo que necesitas para gestionar tu flota vehicular de forma profesional</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🏢', title: 'Multi-Empresa', desc: 'Gestiona múltiples empresas con aislamiento de datos completo y seguridad garantizada.' },
            { icon: '👥', title: 'Gestión de Usuarios', desc: 'Control de acceso basado en roles: Propietario, Administrador, Supervisor y Operador.' },
            { icon: '🚗', title: 'Control de Vehículos', desc: 'Administra toda tu flota con información detallada y estados en tiempo real.' },
            { icon: '📍', title: 'Rastreo GPS', desc: 'Monitoreo en tiempo real con protocolo TK103/Coban. Ubicación, velocidad y telemetría.' },
            { icon: '🔔', title: 'Alertas Inteligentes', desc: 'Geocercas, exceso de velocidad, SOS, batería baja y más. Notificaciones instantáneas.' },
            { icon: '🔒', title: 'Seguridad Avanzada', desc: 'Autenticación Firebase, reglas de seguridad granulares y aislamiento por tenant.' },
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 group">
              <div className="text-3xl mb-5">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Planes Disponibles</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Escala según las necesidades de tu operación</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Essential */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-semibold mb-2">Essential</h3>
            <p className="text-gray-400 text-sm mb-6">Perfecto para pequeñas empresas</p>
            <div className="text-3xl font-bold mb-6">10 <span className="text-base text-gray-500 font-normal">vehículos</span></div>
            <ul className="space-y-3 text-gray-300 text-sm mb-8">
              <li className="flex items-center gap-2"><CheckIcon /> Gestión básica de vehículos</li>
              <li className="flex items-center gap-2"><CheckIcon /> Hasta 5 usuarios</li>
              <li className="flex items-center gap-2"><CheckIcon /> Dashboard completo</li>
              <li className="flex items-center gap-2"><CheckIcon /> Soporte por email</li>
            </ul>
            <Link href="/register">
              <Button variant="secondary" className="w-full">Seleccionar</Button>
            </Link>
          </div>
          {/* Professional */}
          <div className="glass-card p-8 relative border-blue-500/30">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold">
              POPULAR
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional</h3>
            <p className="text-gray-400 text-sm mb-6">Para empresas en crecimiento</p>
            <div className="text-3xl font-bold mb-6">50 <span className="text-base text-gray-500 font-normal">vehículos</span></div>
            <ul className="space-y-3 text-gray-300 text-sm mb-8">
              <li className="flex items-center gap-2"><CheckIcon /> Gestión avanzada de vehículos</li>
              <li className="flex items-center gap-2"><CheckIcon /> Hasta 20 usuarios</li>
              <li className="flex items-center gap-2"><CheckIcon /> Rastreo GPS en tiempo real</li>
              <li className="flex items-center gap-2"><CheckIcon /> Alertas y geocercas</li>
              <li className="flex items-center gap-2"><CheckIcon /> Soporte prioritario</li>
            </ul>
            <Link href="/register">
              <Button variant="primary" className="w-full">Seleccionar</Button>
            </Link>
          </div>
          {/* Enterprise */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
            <p className="text-gray-400 text-sm mb-6">Para grandes operaciones</p>
            <div className="text-3xl font-bold mb-6">500 <span className="text-base text-gray-500 font-normal">vehículos</span></div>
            <ul className="space-y-3 text-gray-300 text-sm mb-8">
              <li className="flex items-center gap-2"><CheckIcon /> Gestión ilimitada</li>
              <li className="flex items-center gap-2"><CheckIcon /> Usuarios ilimitados</li>
              <li className="flex items-center gap-2"><CheckIcon /> Fleet AI integrado</li>
              <li className="flex items-center gap-2"><CheckIcon /> API access</li>
              <li className="flex items-center gap-2"><CheckIcon /> Soporte 24/7 dedicado</li>
            </ul>
            <Link href="/register">
              <Button variant="secondary" className="w-full">Contactar Ventas</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
        <div className="glass-card p-12 md:p-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">¿Listo para comenzar?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Crea tu cuenta hoy y comienza a gestionar tu flota vehicular de forma profesional.
          </p>
          <Link href="/register">
            <Button variant="primary" size="lg">
              Registrarse Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>&copy; 2026 LuCar Fleet. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

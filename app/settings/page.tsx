'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/lib/auth-store';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute requiredPath="/settings">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Configuración</h1>
            <p className="text-gray-400">Administra la configuración de tu cuenta y empresa</p>
          </div>

          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Notificaciones por Email</p>
                  <p className="text-gray-400 text-sm">Recibe alertas sobre actividad importante</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Modo Oscuro</p>
                  <p className="text-gray-400 text-sm">Tema oscuro activado por defecto</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Autenticación de Dos Factores</p>
                  <p className="text-gray-400 text-sm">Aumenta la seguridad de tu cuenta</p>
                </div>
                <Button variant="secondary" size="sm" disabled>
                  Próximamente
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="secondary" className="w-full">
                Cambiar Contraseña
              </Button>

              <Button variant="secondary" className="w-full">
                Ver Sesiones Activas
              </Button>

              <Button variant="secondary" className="w-full">
                Cerrar Todas las Sesiones
              </Button>
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Integraciones y API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400 text-sm">
                Próximamente podrás integrar LuCar Fleet con otros servicios y acceder a nuestra API.
              </p>
              <Button variant="secondary" disabled>
                Generar Token API
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-900 border">
            <CardHeader>
              <CardTitle className="text-red-500">Zona de Peligro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-900/20 border border-red-900 rounded-lg">
                <p className="text-red-200 text-sm mb-3">
                  Estas acciones son irreversibles. Por favor, procede con cuidado.
                </p>
                <Button variant="danger" className="w-full">
                  Eliminar Cuenta
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>Acerca de</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Versión</p>
                <p className="text-white font-medium">Sprint 2 (Beta)</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Última actualización</p>
                <p className="text-white font-medium">Junio 2026</p>
              </div>

              <Button variant="secondary" className="w-full">
                Ver Historial de Cambios
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

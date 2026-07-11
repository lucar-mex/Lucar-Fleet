'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuthStore } from '@/lib/auth-store';

export default function SettingsPage() {
  const { user, company } = useAuthStore();

  return (
    <ProtectedRoute requiredPath="/settings">
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Configuración</h1>
            <p className="text-gray-500 text-sm">Administra la configuración de tu cuenta y empresa</p>
          </div>

          <div className="grid gap-6 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <p className="text-white font-medium text-sm">Notificaciones por Email</p>
                      <p className="text-gray-500 text-xs mt-0.5">Recibe alertas y reportes en tu correo</p>
                    </div>
                    <div className="w-10 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-blue-500 rounded-full transition-all" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <p className="text-white font-medium text-sm">Alertas de Velocidad</p>
                      <p className="text-gray-500 text-xs mt-0.5">Notificaciones cuando un vehículo excede el límite</p>
                    </div>
                    <div className="w-10 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-blue-500 rounded-full transition-all" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <p className="text-white font-medium text-sm">Alertas de Geocerca</p>
                      <p className="text-gray-500 text-xs mt-0.5">Notificaciones de entrada/salida de zonas</p>
                    </div>
                    <div className="w-10 h-6 bg-white/[0.06] border border-white/[0.1] rounded-full relative cursor-pointer">
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-gray-500 rounded-full transition-all" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GPS y Rastreo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <p className="text-white font-medium text-sm">Límite de Velocidad</p>
                      <p className="text-gray-500 text-xs mt-0.5">Velocidad máxima permitida (km/h)</p>
                    </div>
                    <span className="text-white font-medium text-sm">120 km/h</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <p className="text-white font-medium text-sm">Intervalo de Reporte</p>
                      <p className="text-gray-500 text-xs mt-0.5">Frecuencia de envío de posición GPS</p>
                    </div>
                    <span className="text-white font-medium text-sm">30 segundos</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <p className="text-white font-medium text-sm">Zona Horaria</p>
                      <p className="text-gray-500 text-xs mt-0.5">Zona horaria para reportes y alertas</p>
                    </div>
                    <span className="text-white font-medium text-sm">America/Mexico_City</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cuenta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <p className="text-white font-medium text-sm">Plan Actual</p>
                      <p className="text-gray-500 text-xs mt-0.5">{company?.plan || 'Essential'}</p>
                    </div>
                    <span className="text-blue-400 text-sm font-medium cursor-pointer hover:text-blue-300">Cambiar Plan</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <p className="text-white font-medium text-sm">Idioma</p>
                      <p className="text-gray-500 text-xs mt-0.5">Idioma de la interfaz</p>
                    </div>
                    <span className="text-white font-medium text-sm">Español</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

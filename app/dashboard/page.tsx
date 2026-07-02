'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useAuthStore } from '@/lib/auth-store';
import {
  getEmpresa,
  getUsuariosByEmpresa,
  getVehiculosByEmpresa,
  getVehiculosActivosByEmpresa,
  getVehiculoCountByEmpresa,
} from '@/lib/firestore-service';
import { Empresa, Usuario, Vehiculo } from '@/lib/types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [vehiculosActivos, setVehiculosActivos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.empresaID) return;

      try {
        const empresaData = await getEmpresa(user.empresaID);
        const usuariosData = await getUsuariosByEmpresa(user.empresaID);
        const vehiculosData = await getVehiculosByEmpresa(user.empresaID);
        const vehiculosActivosCount = await getVehiculosActivosByEmpresa(user.empresaID);

        setEmpresa(empresaData);
        setUsuarios(usuariosData);
        setVehiculos(vehiculosData);
        setVehiculosActivos(vehiculosActivosCount);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.empresaID]);

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      Activo: 'success',
      Inactivo: 'warning',
      Suspendido: 'danger',
      Cancelado: 'danger',
    };
    return variants[estado] || 'default';
  };

  const getPlanColor = (plan: string) => {
    const colors: Record<string, string> = {
      Essential: 'bg-blue-900 text-blue-200',
      Professional: 'bg-purple-900 text-purple-200',
      Enterprise: 'bg-green-900 text-green-200',
    };
    return colors[plan] || 'bg-gray-700 text-gray-200';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Cargando datos...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Panel de Control</h1>
            <p className="text-gray-400">Bienvenido, {user?.nombre}</p>
          </div>

          {/* Company Info */}
          {empresa && (
            <Card>
              <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Nombre</p>
                    <p className="text-white font-medium">{empresa.nombre}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Plan Actual</p>
                    <Badge variant="info" className={getPlanColor(empresa.planActual)}>
                      {empresa.planActual}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Estado</p>
                    <Badge variant={getEstadoBadge(empresa.estado)}>
                      {empresa.estado}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Próxima Renovación</p>
                    <p className="text-white font-medium">
                      {new Date(empresa.fechaRenovacion).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Vehículos Permitidos</p>
                    <p className="text-white font-medium">{empresa.maxVehiculos}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Correo</p>
                    <p className="text-white font-medium">{empresa.correo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Total de Vehículos</p>
                  <p className="text-3xl font-bold text-blue-500">{vehiculos.length}</p>
                  <p className="text-gray-500 text-xs mt-2">de {empresa?.maxVehiculos}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Vehículos Activos</p>
                  <p className="text-3xl font-bold text-green-500">{vehiculosActivos}</p>
                  <p className="text-gray-500 text-xs mt-2">en operación</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Total de Usuarios</p>
                  <p className="text-3xl font-bold text-purple-500">{usuarios.length}</p>
                  <p className="text-gray-500 text-xs mt-2">en la empresa</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Capacidad Usada</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {empresa ? Math.round((vehiculos.length / empresa.maxVehiculos) * 100) : 0}%
                  </p>
                  <p className="text-gray-500 text-xs mt-2">del plan</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Vehicles */}
          <Card>
            <CardHeader>
              <CardTitle>Vehículos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {vehiculos.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No hay vehículos registrados</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">Nombre</th>
                        <th className="text-left py-3 px-4 text-gray-400">Placas</th>
                        <th className="text-left py-3 px-4 text-gray-400">Tipo</th>
                        <th className="text-left py-3 px-4 text-gray-400">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehiculos.slice(0, 5).map((vehiculo) => (
                        <tr key={vehiculo.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="py-3 px-4">{vehiculo.nombreInterno}</td>
                          <td className="py-3 px-4">{vehiculo.placas}</td>
                          <td className="py-3 px-4">{vehiculo.tipoVehiculo}</td>
                          <td className="py-3 px-4">
                            <Badge variant={getEstadoBadge(vehiculo.estado)}>
                              {vehiculo.estado}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useAuthStore } from '@/lib/auth-store';
import { getVehiclesByCompany, getUsersByCompany } from '@/lib/firestore-service';
import { Vehicle, User } from '@/lib/types';

export default function DashboardPage() {
  const { user, company } = useAuthStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user?.companyId]);

  const loadData = async () => {
    if (!user?.companyId) return;
    try {
      const [vehicleData, userData] = await Promise.all([
        getVehiclesByCompany(user.companyId),
        getUsersByCompany(user.companyId),
      ]);
      setVehicles(vehicleData);
      setUsers(userData);
    } catch (error) {
      console.error('[Dashboard] Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeVehicles = vehicles.filter((v) => v.status === 'active').length;
  const capacityPercent = company ? Math.round((vehicles.length / company.maxVehicles) * 100) : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'danger';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'maintenance': return 'Mantenimiento';
      default: return status;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredPath="/dashboard">
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPath="/dashboard">
      <Layout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Panel de Control</h1>
            <p className="text-gray-500 text-sm">Resumen de tu operación</p>
          </div>

          {/* Company Info */}
          {company && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{company.name}</h3>
                    <p className="text-gray-500 text-sm">{company.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="info">{company.plan}</Badge>
                    <Badge variant={company.status === 'active' ? 'success' : 'danger'}>
                      {company.status === 'active' ? 'Activo' : company.status}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/[0.06]">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Renovación</p>
                    <p className="text-white text-sm font-medium">
                      {new Date(company.renewalDate).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Vehículos Max</p>
                    <p className="text-white text-sm font-medium">{company.maxVehicles}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Teléfono</p>
                    <p className="text-white text-sm font-medium">{company.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Dirección</p>
                    <p className="text-white text-sm font-medium truncate">{company.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Vehículos</p>
                    <p className="text-3xl font-bold text-white">{vehicles.length}</p>
                    <p className="text-gray-500 text-xs mt-1">de {company?.maxVehicles}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.4L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Activos</p>
                    <p className="text-3xl font-bold text-emerald-400">{activeVehicles}</p>
                    <p className="text-gray-500 text-xs mt-1">en operación</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Usuarios</p>
                    <p className="text-3xl font-bold text-purple-400">{users.length}</p>
                    <p className="text-gray-500 text-xs mt-1">en la empresa</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Capacidad</p>
                    <p className="text-3xl font-bold text-amber-400">{capacityPercent}%</p>
                    <p className="text-gray-500 text-xs mt-1">del plan</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
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
              {vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.4L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">No hay vehículos registrados</p>
                  <p className="text-gray-600 text-xs mt-1">Agrega tu primer vehículo desde la sección de Vehículos</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left py-3 px-4">Nombre</th>
                        <th className="text-left py-3 px-4">Placas</th>
                        <th className="text-left py-3 px-4">Tipo</th>
                        <th className="text-left py-3 px-4">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.slice(0, 5).map((vehicle) => (
                        <tr key={vehicle.id} className="border-b border-white/[0.03]">
                          <td className="py-3 px-4 text-white font-medium">{vehicle.internalName}</td>
                          <td className="py-3 px-4 text-gray-400">{vehicle.plates}</td>
                          <td className="py-3 px-4 text-gray-400">{vehicle.type}</td>
                          <td className="py-3 px-4">
                            <Badge variant={getStatusBadge(vehicle.status)}>
                              {getStatusLabel(vehicle.status)}
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

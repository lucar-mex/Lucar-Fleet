'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useAuthStore } from '@/lib/auth-store';
import { getEmpresa, updateEmpresa } from '@/lib/firestore-service';
import { Empresa, PLAN_LIMITS } from '@/lib/types';

export default function CompaniesPage() {
  const { user, empresa } = useAuthStore();
  const [empresaData, setEmpresaData] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    razonSocial: '',
    rfc: '',
    correo: '',
    telefono: '',
    direccion: '',
    planActual: 'Essential' as const,
  });

  useEffect(() => {
    loadEmpresa();
  }, [user?.empresaID]);

  const loadEmpresa = async () => {
    if (!user?.empresaID) return;
    try {
      const data = await getEmpresa(user.empresaID);
      setEmpresaData(data);
      if (data) {
        setFormData({
          nombre: data.nombre,
          razonSocial: data.razonSocial || '',
          rfc: data.rfc || '',
          correo: data.correo,
          telefono: data.telefono,
          direccion: data.direccion,
          planActual: data.planActual,
        });
      }
    } catch (error) {
      console.error('Error loading company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.empresaID) return;
    setIsSaving(true);

    try {
      await updateEmpresa(user.empresaID, formData);
      await loadEmpresa();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving company:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      Activo: 'success',
      Suspendido: 'warning',
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
      <ProtectedRoute requiredPath="/companies">
        <Layout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Cargando empresa...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!empresaData) {
    return (
      <ProtectedRoute requiredPath="/companies">
        <Layout>
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-400 text-center">No se encontró información de la empresa</p>
            </CardContent>
          </Card>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPath="/companies">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mi Empresa</h1>
              <p className="text-gray-400">Información y configuración de la empresa</p>
            </div>
            <Button variant="primary" onClick={() => setIsEditModalOpen(true)}>
              Editar Información
            </Button>
          </div>

          {/* Company Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Nombre</p>
                  <p className="text-white font-medium">{empresaData.nombre}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Razón Social</p>
                  <p className="text-white font-medium">{empresaData.razonSocial || 'No especificada'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">RFC</p>
                  <p className="text-white font-medium">{empresaData.rfc || 'No especificado'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Correo</p>
                  <p className="text-white font-medium">{empresaData.correo}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Teléfono</p>
                  <p className="text-white font-medium">{empresaData.telefono}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Dirección</p>
                  <p className="text-white font-medium">{empresaData.direccion}</p>
                </div>
              </CardContent>
            </Card>

            {/* Plan Info */}
            <Card>
              <CardHeader>
                <CardTitle>Plan y Suscripción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Plan Actual</p>
                  <Badge variant="info" className={getPlanColor(empresaData.planActual)}>
                    {empresaData.planActual}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Vehículos Permitidos</p>
                  <p className="text-white font-medium">{empresaData.maxVehiculos}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Próxima Renovación</p>
                  <p className="text-white font-medium">
                    {new Date(empresaData.fechaRenovacion).toLocaleDateString('es-MX')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status Info */}
            <Card>
              <CardHeader>
                <CardTitle>Estado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Estado de la Empresa</p>
                  <Badge variant={getEstadoBadge(empresaData.estado)}>
                    {empresaData.estado}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Fecha de Alta</p>
                  <p className="text-white font-medium">
                    {new Date(empresaData.fechaAlta).toLocaleDateString('es-MX')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Modal */}
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Editar Información de la Empresa"
            footer={
              <>
                <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" isLoading={isSaving} onClick={handleSave}>
                  Guardar Cambios
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input
                label="Nombre de la Empresa"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />

              <Input
                label="Razón Social"
                value={formData.razonSocial}
                onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
              />

              <Input
                label="RFC"
                value={formData.rfc}
                onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
              />

              <Input
                label="Correo Electrónico"
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                required
              />

              <Input
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />

              <Input
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plan
                </label>
                <select
                  value={formData.planActual}
                  onChange={(e) => setFormData({ ...formData, planActual: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Essential">Essential (10 vehículos)</option>
                  <option value="Professional">Professional (50 vehículos)</option>
                  <option value="Enterprise">Enterprise (500 vehículos)</option>
                </select>
              </div>
            </div>
          </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

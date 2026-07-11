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
import { getVehiclesByCompany, createVehicle, updateVehicle, deleteVehicle } from '@/lib/firestore-service';
import { Vehicle } from '@/lib/types';

export default function VehiclesPage() {
  const { user } = useAuthStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    internalName: '',
    economicNumber: '',
    type: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plates: '',
    color: '',
    vin: '',
    initialMileage: 0,
    status: 'active' as 'active' | 'inactive' | 'maintenance',
  });

  useEffect(() => {
    loadVehicles();
  }, [user?.companyId]);

  const loadVehicles = async () => {
    if (!user?.companyId) return;
    try {
      const data = await getVehiclesByCompany(user.companyId);
      setVehicles(data);
    } catch (error) {
      console.error('[Vehicles] Error loading:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      internalName: '', economicNumber: '', type: '', brand: '', model: '',
      year: new Date().getFullYear(), plates: '', color: '', vin: '', initialMileage: 0, status: 'active',
    });
    setEditingVehicle(null);
  };

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        internalName: vehicle.internalName,
        economicNumber: vehicle.economicNumber,
        type: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        plates: vehicle.plates,
        color: vehicle.color,
        vin: vehicle.vin || '',
        initialMileage: vehicle.initialMileage,
        status: vehicle.status,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!user?.companyId) return;
    setIsSaving(true);
    try {
      if (editingVehicle) {
        await updateVehicle(user.companyId, editingVehicle.id, formData);
      } else {
        await createVehicle(user.companyId, formData);
      }
      await loadVehicles();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('[Vehicles] Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (vehicleId: string) => {
    if (!user?.companyId) return;
    try {
      await deleteVehicle(user.companyId, vehicleId);
      await loadVehicles();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('[Vehicles] Error deleting:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'danger';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) { case 'active': return 'Activo'; case 'inactive': return 'Inactivo'; case 'maintenance': return 'Mantenimiento'; default: return status; }
  };

  return (
    <ProtectedRoute requiredPath="/vehicles">
      <Layout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Vehículos</h1>
              <p className="text-gray-500 text-sm">{vehicles.length} vehículos registrados</p>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              Agregar Vehículo
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">No hay vehículos registrados</p>
                  <p className="text-gray-600 text-xs mt-1">Haz clic en &quot;Agregar Vehículo&quot; para comenzar</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left py-3 px-4">Nombre</th>
                        <th className="text-left py-3 px-4">Placas</th>
                        <th className="text-left py-3 px-4">Marca / Modelo</th>
                        <th className="text-left py-3 px-4">Tipo</th>
                        <th className="text-left py-3 px-4">Estado</th>
                        <th className="text-right py-3 px-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="border-b border-white/[0.03]">
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-white font-medium">{vehicle.internalName}</p>
                              <p className="text-gray-500 text-xs">{vehicle.economicNumber}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-400">{vehicle.plates}</td>
                          <td className="py-3 px-4 text-gray-400">{vehicle.brand} {vehicle.model} ({vehicle.year})</td>
                          <td className="py-3 px-4 text-gray-400">{vehicle.type}</td>
                          <td className="py-3 px-4">
                            <Badge variant={getStatusBadge(vehicle.status)}>{getStatusLabel(vehicle.status)}</Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenModal(vehicle)}>Editar</Button>
                              {deleteConfirm === vehicle.id ? (
                                <Button variant="danger" size="sm" onClick={() => handleDelete(vehicle.id)}>Confirmar</Button>
                              ) : (
                                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(vehicle.id)}>Eliminar</Button>
                              )}
                            </div>
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

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); resetForm(); }}
          title={editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancelar</Button>
              <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                {editingVehicle ? 'Guardar Cambios' : 'Crear Vehículo'}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombre Interno" value={formData.internalName} onChange={(e) => setFormData({ ...formData, internalName: e.target.value })} required />
              <Input label="Número Económico" value={formData.economicNumber} onChange={(e) => setFormData({ ...formData, economicNumber: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Marca" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
              <Input label="Modelo" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Año" type="number" value={String(formData.year)} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} />
              <Input label="Placas" value={formData.plates} onChange={(e) => setFormData({ ...formData, plates: e.target.value })} required />
              <Input label="Color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Tipo de Vehículo" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
              <Input label="VIN" value={formData.vin} onChange={(e) => setFormData({ ...formData, vin: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Kilometraje Inicial" type="number" value={String(formData.initialMileage)} onChange={(e) => setFormData({ ...formData, initialMileage: parseInt(e.target.value) || 0 })} />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 tracking-tight">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'maintenance' })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:bg-white/[0.05] focus:border-blue-500/50 transition-all text-[0.9375rem]"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      </Layout>
    </ProtectedRoute>
  );
}

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
import {
  getVehiculosByEmpresa,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
} from '@/lib/firestore-service';
import { Vehiculo } from '@/lib/types';

export default function VehiclesPage() {
  const { user } = useAuthStore();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nombreInterno: '',
    numeroEconomico: '',
    tipoVehiculo: '',
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    placas: '',
    color: '',
    vin: '',
    kilometrajeInicial: 0,
    estado: 'Activo' as 'Activo' | 'Inactivo' | 'Mantenimiento',
  });

  useEffect(() => {
    loadVehiculos();
  }, [user?.empresaID]);

  const loadVehiculos = async () => {
    if (!user?.empresaID) return;
    try {
      const data = await getVehiculosByEmpresa(user.empresaID);
      setVehiculos(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (vehiculo?: Vehiculo) => {
    if (vehiculo) {
      setEditingVehiculo(vehiculo);
      setFormData({
        nombreInterno: vehiculo.nombreInterno,
        numeroEconomico: vehiculo.numeroEconomico,
        tipoVehiculo: vehiculo.tipoVehiculo,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        año: vehiculo.año,
        placas: vehiculo.placas,
        color: vehiculo.color,
        vin: vehiculo.vin || '',
        kilometrajeInicial: vehiculo.kilometrajeInicial,
        estado: vehiculo.estado,
      });
    } else {
      setEditingVehiculo(null);
      setFormData({
        nombreInterno: '',
        numeroEconomico: '',
        tipoVehiculo: '',
        marca: '',
        modelo: '',
        año: new Date().getFullYear(),
        placas: '',
        color: '',
        vin: '',
        kilometrajeInicial: 0,
        estado: 'Activo',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!user?.empresaID) return;
    setIsSaving(true);

    try {
      if (editingVehiculo) {
        await updateVehiculo(editingVehiculo.id, {
          ...formData,
          empresaID: user.empresaID,
        });
      } else {
        await createVehiculo({
          ...formData,
          empresaID: user.empresaID,
        });
      }
      await loadVehiculos();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving vehicle:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVehiculo(id);
      await loadVehiculos();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      Activo: 'success',
      Inactivo: 'warning',
      Mantenimiento: 'warning',
    };
    return variants[estado] || 'default';
  };

  if (loading) {
    return (
      <ProtectedRoute requiredPath="/vehicles">
        <Layout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Cargando vehículos...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPath="/vehicles">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Vehículos</h1>
              <p className="text-gray-400">Gestiona los vehículos de tu empresa</p>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              + Nuevo Vehículo
            </Button>
          </div>

          {/* Vehicles Table */}
          <Card>
            <CardContent className="pt-6">
              {vehiculos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No hay vehículos registrados</p>
                  <Button variant="primary" onClick={() => handleOpenModal()}>
                    Crear Primer Vehículo
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">Nombre</th>
                        <th className="text-left py-3 px-4 text-gray-400">Placas</th>
                        <th className="text-left py-3 px-4 text-gray-400">Marca/Modelo</th>
                        <th className="text-left py-3 px-4 text-gray-400">Tipo</th>
                        <th className="text-left py-3 px-4 text-gray-400">Estado</th>
                        <th className="text-left py-3 px-4 text-gray-400">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehiculos.map((vehiculo) => (
                        <tr key={vehiculo.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="py-3 px-4">{vehiculo.nombreInterno}</td>
                          <td className="py-3 px-4 font-mono">{vehiculo.placas}</td>
                          <td className="py-3 px-4">{vehiculo.marca} {vehiculo.modelo}</td>
                          <td className="py-3 px-4">{vehiculo.tipoVehiculo}</td>
                          <td className="py-3 px-4">
                            <Badge variant={getEstadoBadge(vehiculo.estado)}>
                              {vehiculo.estado}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleOpenModal(vehiculo)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setDeleteConfirm(vehiculo.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            footer={
              <>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" isLoading={isSaving} onClick={handleSave}>
                  {editingVehiculo ? 'Actualizar' : 'Crear'}
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input
                label="Nombre Interno"
                placeholder="Vehículo 001"
                value={formData.nombreInterno}
                onChange={(e) => setFormData({ ...formData, nombreInterno: e.target.value })}
                required
              />

              <Input
                label="Número Económico"
                placeholder="001"
                value={formData.numeroEconomico}
                onChange={(e) => setFormData({ ...formData, numeroEconomico: e.target.value })}
                required
              />

              <Input
                label="Placas"
                placeholder="ABC-1234"
                value={formData.placas}
                onChange={(e) => setFormData({ ...formData, placas: e.target.value })}
                required
              />

              <Input
                label="Tipo de Vehículo"
                placeholder="Camión, Auto, etc."
                value={formData.tipoVehiculo}
                onChange={(e) => setFormData({ ...formData, tipoVehiculo: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Marca"
                  placeholder="Toyota"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  required
                />
                <Input
                  label="Modelo"
                  placeholder="Hilux"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Año"
                  type="number"
                  value={formData.año}
                  onChange={(e) => setFormData({ ...formData, año: parseInt(e.target.value) })}
                  required
                />
                <Input
                  label="Color"
                  placeholder="Blanco"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>

              <Input
                label="VIN (Opcional)"
                placeholder="WVWZZZ3CZ9E..."
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
              />

              <Input
                label="Kilometraje Inicial"
                type="number"
                value={formData.kilometrajeInicial}
                onChange={(e) => setFormData({ ...formData, kilometrajeInicial: parseInt(e.target.value) })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
              </div>
            </div>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={deleteConfirm !== null}
            onClose={() => setDeleteConfirm(null)}
            title="Confirmar Eliminación"
            footer={
              <>
                <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                >
                  Eliminar
                </Button>
              </>
            }
          >
            <p className="text-gray-300">
              ¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.
            </p>
          </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

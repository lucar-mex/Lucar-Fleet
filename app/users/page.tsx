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
  getUsuariosByEmpresa,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from '@/lib/firestore-service';
import { Usuario, UserRole } from '@/lib/types';
import { getRoleLabel } from '@/lib/rbac';

export default function UsersPage() {
  const { user } = useAuthStore();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    cargo: '',
    rol: 'Operador' as UserRole,
    estado: 'Activo' as 'Activo' | 'Inactivo',
  });

  useEffect(() => {
    loadUsuarios();
  }, [user?.empresaID]);

  const loadUsuarios = async () => {
    if (!user?.empresaID) return;
    try {
      const data = await getUsuariosByEmpresa(user.empresaID);
      setUsuarios(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (usuario?: Usuario) => {
    if (usuario) {
      setEditingUsuario(usuario);
      setFormData({
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        cargo: usuario.cargo,
        rol: usuario.rol,
        estado: usuario.estado,
      });
    } else {
      setEditingUsuario(null);
      setFormData({
        nombre: '',
        correo: '',
        telefono: '',
        cargo: '',
        rol: 'Operador',
        estado: 'Activo',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!user?.empresaID) return;
    setIsSaving(true);

    try {
      if (editingUsuario) {
        await updateUsuario(editingUsuario.id, {
          ...formData,
          empresaID: user.empresaID,
        });
      } else {
        // For new users, we'd need Firebase auth setup
        // For now, just create the user record
        await createUsuario({
          ...formData,
          empresaID: user.empresaID,
          uid: '', // Would be set during proper registration
        });
      }
      await loadUsuarios();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUsuario(id);
      await loadUsuarios();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    return estado === 'Activo' ? 'success' : 'warning';
  };

  const getRoleBadge = (rol: UserRole) => {
    const variants: Record<UserRole, 'info' | 'warning' | 'success' | 'danger'> = {
      Propietario: 'danger',
      Administrador: 'warning',
      Supervisor: 'info',
      Operador: 'success',
    };
    return variants[rol];
  };

  if (loading) {
    return (
      <ProtectedRoute requiredPath="/users">
        <Layout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Cargando usuarios...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPath="/users">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Usuarios</h1>
              <p className="text-gray-400">Gestiona los usuarios de tu empresa</p>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              + Nuevo Usuario
            </Button>
          </div>

          {/* Users Table */}
          <Card>
            <CardContent className="pt-6">
              {usuarios.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No hay usuarios registrados</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">Nombre</th>
                        <th className="text-left py-3 px-4 text-gray-400">Correo</th>
                        <th className="text-left py-3 px-4 text-gray-400">Cargo</th>
                        <th className="text-left py-3 px-4 text-gray-400">Rol</th>
                        <th className="text-left py-3 px-4 text-gray-400">Estado</th>
                        <th className="text-left py-3 px-4 text-gray-400">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="py-3 px-4">{usuario.nombre}</td>
                          <td className="py-3 px-4">{usuario.correo}</td>
                          <td className="py-3 px-4">{usuario.cargo}</td>
                          <td className="py-3 px-4">
                            <Badge variant={getRoleBadge(usuario.rol)}>
                              {getRoleLabel(usuario.rol)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getEstadoBadge(usuario.estado)}>
                              {usuario.estado}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleOpenModal(usuario)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setDeleteConfirm(usuario.id)}
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
            title={editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
            footer={
              <>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" isLoading={isSaving} onClick={handleSave}>
                  {editingUsuario ? 'Actualizar' : 'Crear'}
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input
                label="Nombre Completo"
                placeholder="Juan Pérez"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />

              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="juan@email.com"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                required
              />

              <Input
                label="Teléfono"
                placeholder="+55 1234567890"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />

              <Input
                label="Cargo"
                placeholder="Gerente de Flota"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rol
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value as UserRole })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Propietario">Propietario</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Operador">Operador</option>
                </select>
              </div>

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
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </p>
          </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

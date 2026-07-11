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
import { getUsersByCompany, updateUser, deleteUser } from '@/lib/firestore-service';
import { User, UserRole } from '@/lib/types';
import { getRoleLabel } from '@/lib/rbac';

export default function UsersPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    role: 'operator' as UserRole,
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    loadUsers();
  }, [user?.companyId]);

  const loadUsers = async () => {
    if (!user?.companyId) return;
    try {
      const data = await getUsersByCompany(user.companyId);
      setUsers(data);
    } catch (error) {
      console.error('[Users] Error loading:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', position: '', role: 'operator', status: 'active' });
    setEditingUser(null);
  };

  const handleOpenModal = (u?: User) => {
    if (u) {
      setEditingUser(u);
      setFormData({
        name: u.name,
        email: u.email,
        phone: u.phone,
        position: u.position,
        role: u.role,
        status: u.status,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!user?.companyId || !editingUser) return;
    setIsSaving(true);
    try {
      await updateUser(user.companyId, editingUser.id, {
        name: formData.name,
        phone: formData.phone,
        position: formData.position,
        role: formData.role,
        status: formData.status,
      });
      await loadUsers();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('[Users] Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!user?.companyId) return;
    try {
      await deleteUser(user.companyId, userId);
      await loadUsers();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('[Users] Error deleting:', error);
    }
  };

  return (
    <ProtectedRoute requiredPath="/users">
      <Layout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Usuarios</h1>
              <p className="text-gray-500 text-sm">{users.length} usuarios en la empresa</p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-sm">No hay usuarios registrados</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left py-3 px-4">Nombre</th>
                        <th className="text-left py-3 px-4">Correo</th>
                        <th className="text-left py-3 px-4">Cargo</th>
                        <th className="text-left py-3 px-4">Rol</th>
                        <th className="text-left py-3 px-4">Estado</th>
                        <th className="text-right py-3 px-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-white/[0.03]">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/[0.08] flex items-center justify-center text-xs font-semibold text-blue-400">
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-white font-medium">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-400">{u.email}</td>
                          <td className="py-3 px-4 text-gray-400">{u.position}</td>
                          <td className="py-3 px-4">
                            <Badge variant="info">{getRoleLabel(u.role)}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={u.status === 'active' ? 'success' : 'danger'}>
                              {u.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenModal(u)}>Editar</Button>
                              {u.id !== user?.id && (
                                deleteConfirm === u.id ? (
                                  <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>Confirmar</Button>
                                ) : (
                                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(u.id)}>Eliminar</Button>
                                )
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

        <Modal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); resetForm(); }}
          title="Editar Usuario"
          footer={
            <>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancelar</Button>
              <Button variant="primary" onClick={handleSave} isLoading={isSaving}>Guardar Cambios</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input label="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Correo" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Teléfono" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              <Input label="Cargo" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 tracking-tight">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:bg-white/[0.05] focus:border-blue-500/50 transition-all text-[0.9375rem]"
                >
                  <option value="owner">Propietario</option>
                  <option value="admin">Administrador</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="operator">Operador</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 tracking-tight">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:bg-white/[0.05] focus:border-blue-500/50 transition-all text-[0.9375rem]"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      </Layout>
    </ProtectedRoute>
  );
}

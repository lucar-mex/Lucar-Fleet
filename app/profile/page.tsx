'use client';
import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useAuthStore } from '@/lib/auth-store';
import { updateUser } from '@/lib/firestore-service';
import { getRoleLabel } from '@/lib/rbac';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    position: user?.position || '',
  });

  const handleSave = async () => {
    if (!user?.id || !user?.companyId) return;
    setIsSaving(true);
    try {
      await updateUser(user.companyId, user.id, {
        name: formData.name,
        phone: formData.phone,
        position: formData.position,
      });
      setUser({ ...user, ...formData, updatedAt: new Date() });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('[Profile] Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute requiredPath="/profile">
      <Layout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Mi Perfil</h1>
              <p className="text-gray-500 text-sm">Información de tu cuenta</p>
            </div>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
              Editar Perfil
            </Button>
          </div>

          {user && (
            <div className="grid gap-6 max-w-2xl">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{user.name}</h2>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="info">{getRoleLabel(user.role)}</Badge>
                        <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/[0.06]">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Teléfono</p>
                      <p className="text-white font-medium">{user.phone || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Cargo</p>
                      <p className="text-white font-medium">{user.position}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Último Acceso</p>
                      <p className="text-white font-medium">
                        {user.lastAccess ? new Date(user.lastAccess).toLocaleString('es-MX') : 'Primera sesión'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Miembro Desde</p>
                      <p className="text-white font-medium">
                        {new Date(user.createdAt).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Perfil"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
              <Button variant="primary" onClick={handleSave} isLoading={isSaving}>Guardar</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input label="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Teléfono" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <Input label="Cargo" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
          </div>
        </Modal>
      </Layout>
    </ProtectedRoute>
  );
}

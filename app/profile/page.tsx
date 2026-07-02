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
import { updateUsuario } from '@/lib/firestore-service';
import { getRoleLabel } from '@/lib/rbac';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    correo: user?.correo || '',
    telefono: user?.telefono || '',
    cargo: user?.cargo || '',
  });

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);

    try {
      await updateUsuario(user.id, formData);
      setUser({ ...user, ...formData });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadge = (rol: string) => {
    const variants: Record<string, 'info' | 'warning' | 'success' | 'danger'> = {
      Propietario: 'danger',
      Administrador: 'warning',
      Supervisor: 'info',
      Operador: 'success',
    };
    return variants[rol] || 'info';
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
              <p className="text-gray-400">Información personal y configuración de cuenta</p>
            </div>
            <Button variant="primary" onClick={() => setIsEditModalOpen(true)}>
              Editar Perfil
            </Button>
          </div>

          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                  {user?.nombre?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Nombre Completo</p>
                    <p className="text-white font-medium text-lg">{user?.nombre}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Correo Electrónico</p>
                      <p className="text-white font-medium">{user?.correo}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Teléfono</p>
                      <p className="text-white font-medium">{user?.telefono || 'No especificado'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Cargo</p>
                      <p className="text-white font-medium">{user?.cargo}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Rol</p>
                      <Badge variant={getRoleBadge(user?.rol || '')}>
                        {getRoleLabel(user?.rol as any)}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Estado</p>
                    <Badge variant={user?.estado === 'Activo' ? 'success' : 'warning'}>
                      {user?.estado}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Último Acceso</p>
                <p className="text-white font-medium">
                  {user?.ultimoAcceso
                    ? new Date(user.ultimoAcceso).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Primera vez'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Miembro desde</p>
                <p className="text-white font-medium">
                  {new Date(user?.createdAt || new Date()).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">ID de Usuario</p>
                <p className="text-white font-mono text-xs break-all">{user?.uid}</p>
              </div>
            </CardContent>
          </Card>

          {/* Edit Modal */}
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Editar Perfil"
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
                label="Nombre Completo"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
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
              />

              <Input
                label="Cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                required
              />
            </div>
          </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

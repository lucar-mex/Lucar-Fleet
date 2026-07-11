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
import { updateCompany } from '@/lib/firestore-service';

export default function CompaniesPage() {
  const { company, setCompany } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: company?.name || '',
    legalName: company?.legalName || '',
    taxId: company?.taxId || '',
    email: company?.email || '',
    phone: company?.phone || '',
    address: company?.address || '',
  });

  const handleSave = async () => {
    if (!company?.id) return;
    setIsSaving(true);
    try {
      await updateCompany(company.id, {
        name: formData.name,
        legalName: formData.legalName || undefined,
        taxId: formData.taxId || undefined,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });
      setCompany({ ...company, ...formData, updatedAt: new Date() });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('[Companies] Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute requiredPath="/companies">
      <Layout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Empresa</h1>
              <p className="text-gray-500 text-sm">Información de tu empresa</p>
            </div>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
              Editar
            </Button>
          </div>

          {company && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Nombre</p>
                      <p className="text-white font-medium">{company.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Razón Social</p>
                      <p className="text-white font-medium">{company.legalName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">RFC</p>
                      <p className="text-white font-medium">{company.taxId || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Correo</p>
                      <p className="text-white font-medium">{company.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Teléfono</p>
                      <p className="text-white font-medium">{company.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Dirección</p>
                      <p className="text-white font-medium">{company.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan y Suscripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Plan Actual</p>
                      <Badge variant="info">{company.plan}</Badge>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Estado</p>
                      <Badge variant={company.status === 'active' ? 'success' : 'danger'}>
                        {company.status === 'active' ? 'Activo' : company.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Renovación</p>
                      <p className="text-white font-medium">
                        {new Date(company.renewalDate).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Vehículos Permitidos</p>
                      <p className="text-white font-medium">{company.maxVehicles}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Creada</p>
                      <p className="text-white font-medium">
                        {new Date(company.createdAt).toLocaleDateString('es-MX')}
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
          title="Editar Empresa"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
              <Button variant="primary" onClick={handleSave} isLoading={isSaving}>Guardar</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input label="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Razón Social" value={formData.legalName} onChange={(e) => setFormData({ ...formData, legalName: e.target.value })} />
              <Input label="RFC" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
            </div>
            <Input label="Correo" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Teléfono" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
              <Input label="Dirección" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
            </div>
          </div>
        </Modal>
      </Layout>
    </ProtectedRoute>
  );
}

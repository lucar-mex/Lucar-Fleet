'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createEmpresa, createUsuario, getEmpresa } from '@/lib/firestore-service';
import { useAuthStore } from '@/lib/auth-store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type Step = 'empresa' | 'usuario';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setEmpresa } = useAuthStore();
  const [step, setStep] = useState<Step>('empresa');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [empresaID, setEmpresaID] = useState('');

  // Empresa form
  const [empresaNombre, setEmpresaNombre] = useState('');
  const [empresaRazonSocial, setEmpresaRazonSocial] = useState('');
  const [empresaRFC, setEmpresaRFC] = useState('');
  const [empresaCorreo, setEmpresaCorreo] = useState('');
  const [empresaTelefono, setEmpresaTelefono] = useState('');
  const [empresaDireccion, setEmpresaDireccion] = useState('');
  const [empresaPlan, setEmpresaPlan] = useState<'Essential' | 'Professional' | 'Enterprise'>('Essential');

  // Usuario form
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargo, setCargo] = useState('');

  const handleCreateEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!empresaNombre || !empresaCorreo || !empresaTelefono || !empresaDireccion) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      const newEmpresaID = await createEmpresa({
        nombre: empresaNombre,
        razonSocial: empresaRazonSocial,
        rfc: empresaRFC,
        correo: empresaCorreo,
        telefono: empresaTelefono,
        direccion: empresaDireccion,
        planActual: empresaPlan,
      });

      setEmpresaID(newEmpresaID);
      setStep('usuario');
    } catch (err: any) {
      setError(err.message || 'Error al crear la empresa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!nombre || !email || !password || !cargo) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Create database user
      const usuarioID = await createUsuario({
        nombre,
        correo: email,
        telefono,
        cargo,
        rol: 'Propietario', // First user is always Propietario
        empresaID,
        uid: userCredential.user.uid,
      });

      // Get empresa and user data
      const empresa = await getEmpresa(empresaID);
      const usuario = {
        id: usuarioID,
        nombre,
        correo: email,
        telefono,
        cargo,
        rol: 'Propietario' as const,
        empresaID,
        uid: userCredential.user.uid,
        estado: 'Activo' as const,
        ultimoAcceso: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(usuario);
      setEmpresa(empresa);
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.code === 'auth/email-already-in-use'
        ? 'El correo ya está registrado'
        : err.code === 'auth/weak-password'
        ? 'La contraseña es muy débil'
        : err.message || 'Error al registrar usuario';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-blue-500">LuCar</h1>
            <p className="text-gray-400 text-sm">Fleet Management System</p>
          </div>
          <CardTitle className="text-center">
            {step === 'empresa' ? 'Crear Empresa' : 'Crear Usuario'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'empresa' ? (
            <form onSubmit={handleCreateEmpresa} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Nombre de la Empresa"
                placeholder="Mi Empresa S.A."
                value={empresaNombre}
                onChange={(e) => setEmpresaNombre(e.target.value)}
                required
              />

              <Input
                label="Razón Social (Opcional)"
                placeholder="Razón social completa"
                value={empresaRazonSocial}
                onChange={(e) => setEmpresaRazonSocial(e.target.value)}
              />

              <Input
                label="RFC (Opcional)"
                placeholder="ABC123456XYZ"
                value={empresaRFC}
                onChange={(e) => setEmpresaRFC(e.target.value)}
              />

              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="empresa@email.com"
                value={empresaCorreo}
                onChange={(e) => setEmpresaCorreo(e.target.value)}
                required
              />

              <Input
                label="Teléfono"
                placeholder="+55 1234567890"
                value={empresaTelefono}
                onChange={(e) => setEmpresaTelefono(e.target.value)}
                required
              />

              <Input
                label="Dirección"
                placeholder="Calle Principal 123"
                value={empresaDireccion}
                onChange={(e) => setEmpresaDireccion(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plan
                </label>
                <select
                  value={empresaPlan}
                  onChange={(e) => setEmpresaPlan(e.target.value as any)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Essential">Essential (10 vehículos)</option>
                  <option value="Professional">Professional (50 vehículos)</option>
                  <option value="Enterprise">Enterprise (500 vehículos)</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full"
              >
                Siguiente
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCreateUsuario} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Nombre Completo"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Teléfono"
                placeholder="+55 1234567890"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />

              <Input
                label="Cargo"
                placeholder="Gerente de Flota"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                required
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirmar Contraseña"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setStep('empresa')}
                  className="flex-1"
                >
                  Atrás
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="flex-1"
                >
                  Registrarse
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-blue-500 hover:text-blue-400">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

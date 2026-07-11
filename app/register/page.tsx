'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createCompany, createUser, createUserRef, getCompany } from '@/lib/firestore-service';
import { useAuthStore } from '@/lib/auth-store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type Step = 'company' | 'user';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setCompany } = useAuthStore();
  const [step, setStep] = useState<Step>('company');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyId, setCompanyId] = useState('');

  // Company form
  const [companyName, setCompanyName] = useState('');
  const [companyLegalName, setCompanyLegalName] = useState('');
  const [companyTaxId, setCompanyTaxId] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPlan, setCompanyPlan] = useState<'Essential' | 'Professional' | 'Enterprise'>('Essential');

  // User form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!companyName || !companyEmail || !companyPhone || !companyAddress) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      // We need to create the Firebase user first so we can create the company
      // (Firestore rules require signedIn() for company creation)
      // But we'll create the company in the next step after auth
      // For now, just validate and move to next step
      setStep('user');
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Error al validar datos de empresa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!name || !email || !password || !position) {
        throw new Error('Por favor completa todos los campos requeridos');
      }
      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      console.log('[Register] Creating Firebase auth user...');
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      console.log('[Register] Firebase user created, UID:', uid);

      console.log('[Register] Creating company in Firestore...');
      // 2. Create company document
      const newCompanyId = await createCompany({
        name: companyName,
        legalName: companyLegalName || undefined,
        taxId: companyTaxId || undefined,
        email: companyEmail,
        phone: companyPhone,
        address: companyAddress,
        plan: companyPlan,
      });
      console.log('[Register] Company created, ID:', newCompanyId);
      setCompanyId(newCompanyId);

      console.log('[Register] Creating user in company subcollection...');
      // 3. Create user document in company subcollection (using UID as doc ID)
      await createUser(newCompanyId, uid, {
        name,
        email,
        phone,
        position,
        role: 'owner', // First user is always owner
      });
      console.log('[Register] User created in subcollection');

      console.log('[Register] Creating user reference...');
      // 4. Create user reference for UID lookup
      await createUserRef(uid, newCompanyId);
      console.log('[Register] User reference created');

      // 5. Load company and set state
      const company = await getCompany(newCompanyId);
      const userObj = {
        id: uid,
        name,
        email,
        phone,
        position,
        role: 'owner' as const,
        companyId: newCompanyId,
        status: 'active' as const,
        lastAccess: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(userObj);
      if (company) setCompany(company);
      console.log('[Register] Registration complete, redirecting to dashboard');
      router.push('/dashboard');
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      console.error('[Register] Error:', firebaseErr.code, firebaseErr.message);
      const errorMessage = firebaseErr.code === 'auth/email-already-in-use'
        ? 'El correo ya está registrado'
        : firebaseErr.code === 'auth/weak-password'
        ? 'La contraseña es muy débil'
        : firebaseErr.message || 'Error al registrar usuario';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-mesh flex items-center justify-center p-6">
      <Card className="w-full max-w-lg" hover={false}>
        <CardHeader>
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight gradient-text">LuCar Fleet</h1>
            <p className="text-gray-500 text-sm mt-1">Crea tu cuenta empresarial</p>
          </div>
          <CardTitle className="text-center text-base text-gray-300">
            {step === 'company' ? 'Paso 1: Datos de Empresa' : 'Paso 2: Tu Cuenta'}
          </CardTitle>
          {/* Progress indicator */}
          <div className="flex gap-2 mt-4 px-6">
            <div className={`h-1 flex-1 rounded-full ${step === 'company' ? 'bg-blue-500' : 'bg-blue-500'}`} />
            <div className={`h-1 flex-1 rounded-full ${step === 'user' ? 'bg-blue-500' : 'bg-white/[0.06]'}`} />
          </div>
        </CardHeader>
        <CardContent>
          {step === 'company' ? (
            <form onSubmit={handleCreateCompany} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}
              <Input
                label="Nombre de la Empresa"
                placeholder="Mi Empresa de Transporte"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Razón Social"
                  placeholder="Opcional"
                  value={companyLegalName}
                  onChange={(e) => setCompanyLegalName(e.target.value)}
                />
                <Input
                  label="RFC"
                  placeholder="Opcional"
                  value={companyTaxId}
                  onChange={(e) => setCompanyTaxId(e.target.value)}
                />
              </div>
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="empresa@email.com"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Teléfono"
                  placeholder="+52 55 1234 5678"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 tracking-tight">
                    Plan
                  </label>
                  <select
                    value={companyPlan}
                    onChange={(e) => setCompanyPlan(e.target.value as 'Essential' | 'Professional' | 'Enterprise')}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:bg-white/[0.05] focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all text-[0.9375rem]"
                  >
                    <option value="Essential">Essential (10 vehículos)</option>
                    <option value="Professional">Professional (50 vehículos)</option>
                    <option value="Enterprise">Enterprise (500 vehículos)</option>
                  </select>
                </div>
              </div>
              <Input
                label="Dirección"
                placeholder="Calle Principal 123, Ciudad"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Siguiente
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCreateUser} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}
              <Input
                label="Nombre Completo"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Teléfono"
                  placeholder="+52 55 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label="Cargo"
                  placeholder="Director General"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </div>
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
              <div className="flex gap-3 mt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setStep('company')}
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
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

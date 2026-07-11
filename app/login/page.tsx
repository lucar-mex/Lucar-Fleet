'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserByUID, getCompany, updateLastAccess } from '@/lib/firestore-service';
import { useAuthStore } from '@/lib/auth-store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setCompany, setError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setLocalError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');

    try {
      console.log('[Login] Authenticating with Firebase...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('[Login] Firebase auth successful, UID:', userCredential.user.uid);

      console.log('[Login] Looking up user in Firestore...');
      const result = await getUserByUID(userCredential.user.uid);
      if (!result) {
        console.error('[Login] User not found in Firestore');
        setLocalError('Usuario no encontrado en la base de datos');
        setIsLoading(false);
        return;
      }

      const { user: dbUser, companyId } = result;
      console.log('[Login] User found, companyId:', companyId);

      // Load company
      const company = await getCompany(companyId);
      console.log('[Login] Company loaded:', company?.name);

      // Update last access
      await updateLastAccess(companyId, userCredential.user.uid);

      setUser(dbUser);
      if (company) setCompany(company);
      router.push('/dashboard');
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      console.error('[Login] Error:', firebaseErr.code, firebaseErr.message);
      const errorMessage = firebaseErr.code === 'auth/user-not-found'
        ? 'Usuario no encontrado'
        : firebaseErr.code === 'auth/wrong-password'
        ? 'Contraseña incorrecta'
        : firebaseErr.code === 'auth/invalid-email'
        ? 'Email inválido'
        : firebaseErr.code === 'auth/invalid-credential'
        ? 'Credenciales inválidas'
        : 'Error al iniciar sesión';
      setLocalError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-mesh flex items-center justify-center p-6">
      <Card className="w-full max-w-md" hover={false}>
        <CardHeader>
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight gradient-text">LuCar Fleet</h1>
            <p className="text-gray-500 text-sm mt-1">Plataforma de gestión de flotas</p>
          </div>
          <CardTitle className="text-center text-base text-gray-300">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                {error}
              </div>
            )}
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full"
            >
              Iniciar Sesión
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUsuarioByUID } from '@/lib/firestore-service';
import { useAuthStore } from '@/lib/auth-store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setLocalError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const dbUser = await getUsuarioByUID(userCredential.user.uid);

      if (!dbUser) {
        setLocalError('Usuario no encontrado en la base de datos');
        setIsLoading(false);
        return;
      }

      setUser(dbUser);
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.code === 'auth/user-not-found'
        ? 'Usuario no encontrado'
        : err.code === 'auth/wrong-password'
        ? 'Contraseña incorrecta'
        : err.code === 'auth/invalid-email'
        ? 'Email inválido'
        : 'Error al iniciar sesión';
      setLocalError(errorMessage);
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
          <CardTitle className="text-center">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
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

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-blue-500 hover:text-blue-400">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

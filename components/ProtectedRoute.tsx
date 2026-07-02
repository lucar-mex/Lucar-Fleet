'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from '@/lib/auth-store';
import { getUsuarioByUID } from '@/lib/firestore-service';
import { UserRole } from '@/lib/types';
import { canAccessPage } from '@/lib/rbac';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole[];
  requiredPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredPath,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, setUser, loading, setLoading } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/login');
        setLoading(false);
        return;
      }

      try {
        const dbUser = await getUsuarioByUID(firebaseUser.uid);

        if (!dbUser) {
          router.push('/register');
          setLoading(false);
          return;
        }

        setUser(dbUser);

        // Check role-based access
        if (requiredRole && !requiredRole.includes(dbUser.rol)) {
          router.push('/dashboard');
          setLoading(false);
          return;
        }

        // Check path-based access
        if (requiredPath && !canAccessPage(dbUser.rol, requiredPath)) {
          router.push('/dashboard');
          setLoading(false);
          return;
        }

        setIsAuthorized(true);
        setLoading(false);
      } catch (error) {
        console.error('Error loading user:', error);
        router.push('/login');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, setUser, setLoading, requiredRole, requiredPath]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from '@/lib/auth-store';
import { getUserByUID, getCompany } from '@/lib/firestore-service';
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
  const { user, setUser, setCompany, loading, setLoading } = useAuthStore();
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
        const result = await getUserByUID(firebaseUser.uid);
        if (!result) {
          router.push('/register');
          setLoading(false);
          return;
        }

        const { user: dbUser, companyId } = result;
        setUser(dbUser);

        // Load company data
        const company = await getCompany(companyId);
        if (company) {
          setCompany(company);
        }

        // Check role-based access
        if (requiredRole && !requiredRole.includes(dbUser.role)) {
          router.push('/dashboard');
          setLoading(false);
          return;
        }

        // Check path-based access
        if (requiredPath && !canAccessPage(dbUser.role, requiredPath)) {
          router.push('/dashboard');
          setLoading(false);
          return;
        }

        setIsAuthorized(true);
        setLoading(false);
      } catch (error) {
        console.error('[ProtectedRoute] Error loading user:', error);
        router.push('/login');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, setUser, setCompany, setLoading, requiredRole, requiredPath]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-10 h-10 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

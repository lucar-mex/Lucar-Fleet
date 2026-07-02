import { UserRole } from './types';

// Define permissions for each role
const rolePermissions: Record<UserRole, string[]> = {
  Propietario: [
    'view_dashboard',
    'manage_company',
    'manage_users',
    'manage_vehicles',
    'view_reports',
    'manage_settings',
    'invite_users',
    'delete_users',
  ],
  Administrador: [
    'view_dashboard',
    'manage_users',
    'manage_vehicles',
    'view_reports',
    'manage_settings',
    'invite_users',
  ],
  Supervisor: [
    'view_dashboard',
    'view_users',
    'manage_vehicles',
    'view_reports',
  ],
  Operador: [
    'view_dashboard',
    'view_vehicles',
  ],
};

export const hasPermission = (role: UserRole | null | undefined, permission: string): boolean => {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) ?? false;
};

export const canAccessPage = (role: UserRole | null | undefined, page: string): boolean => {
  if (!role) return false;

  const pagePermissions: Record<string, string[]> = {
    '/dashboard': ['view_dashboard'],
    '/companies': ['manage_company'],
    '/users': ['manage_users', 'view_users'],
    '/vehicles': ['manage_vehicles', 'view_vehicles'],
    '/settings': ['manage_settings'],
    '/profile': [], // Everyone can access their profile
  };

  const requiredPermissions = pagePermissions[page] || [];
  if (requiredPermissions.length === 0) return true;

  return requiredPermissions.some((perm) => hasPermission(role, perm));
};

export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    Propietario: 'Propietario',
    Administrador: 'Administrador',
    Supervisor: 'Supervisor',
    Operador: 'Operador',
  };
  return labels[role];
};

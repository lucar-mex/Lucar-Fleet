import { UserRole } from './types';

const rolePermissions: Record<UserRole, string[]> = {
  owner: [
    'view_dashboard',
    'manage_company',
    'manage_users',
    'manage_vehicles',
    'manage_devices',
    'view_reports',
    'manage_settings',
    'manage_alerts',
    'manage_routes',
  ],
  admin: [
    'view_dashboard',
    'manage_users',
    'manage_vehicles',
    'manage_devices',
    'view_reports',
    'manage_settings',
    'manage_alerts',
  ],
  supervisor: [
    'view_dashboard',
    'view_users',
    'manage_vehicles',
    'manage_devices',
    'view_reports',
    'view_alerts',
  ],
  operator: [
    'view_dashboard',
    'view_vehicles',
    'view_alerts',
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
    '/devices': ['manage_devices'],
    '/settings': ['manage_settings'],
    '/alerts': ['manage_alerts', 'view_alerts'],
    '/profile': [],
  };
  const requiredPermissions = pagePermissions[page] || [];
  if (requiredPermissions.length === 0) return true;
  return requiredPermissions.some((perm) => hasPermission(role, perm));
};

export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    owner: 'Propietario',
    admin: 'Administrador',
    supervisor: 'Supervisor',
    operator: 'Operador',
  };
  return labels[role] || role;
};

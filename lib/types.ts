// Empresa (Company)
export interface Empresa {
  id: string;
  nombre: string;
  razonSocial?: string;
  rfc?: string;
  correo: string;
  telefono: string;
  direccion: string;
  planActual: 'Essential' | 'Professional' | 'Enterprise';
  fechaAlta: Date;
  estado: 'Activo' | 'Suspendido' | 'Cancelado';
  fechaRenovacion: Date;
  maxVehiculos: number;
  createdAt: Date;
  updatedAt: Date;
}

// Usuario (User)
export type UserRole = 'Propietario' | 'Administrador' | 'Supervisor' | 'Operador';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  cargo: string;
  estado: 'Activo' | 'Inactivo';
  ultimoAcceso: Date | null;
  rol: UserRole;
  empresaID: string;
  uid: string; // Firebase UID
  createdAt: Date;
  updatedAt: Date;
}

// Vehículo (Vehicle)
export interface Vehiculo {
  id: string;
  nombreInterno: string;
  numeroEconomico: string;
  tipoVehiculo: string;
  marca: string;
  modelo: string;
  año: number;
  placas: string;
  color: string;
  vin?: string;
  kilometrajeInicial: number;
  estado: 'Activo' | 'Inactivo' | 'Mantenimiento';
  empresaID: string;
  gpsID?: string; // For future GPS integration
  createdAt: Date;
  updatedAt: Date;
}

// Auth Context
export interface AuthContextType {
  user: Usuario | null;
  empresa: Empresa | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<Usuario>, empresaData: Partial<Empresa>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<Usuario>) => Promise<void>;
}

// Plan limits
export const PLAN_LIMITS: Record<string, number> = {
  Essential: 10,
  Professional: 50,
  Enterprise: 500,
};

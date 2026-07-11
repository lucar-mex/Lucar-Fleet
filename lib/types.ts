// ============ CORE ENTITIES ============

export type UserRole = 'owner' | 'admin' | 'supervisor' | 'operator';

export interface Company {
  id: string;
  name: string;
  legalName?: string;
  taxId?: string;
  email: string;
  phone: string;
  address: string;
  plan: 'Essential' | 'Professional' | 'Enterprise';
  status: 'active' | 'suspended' | 'cancelled';
  renewalDate: Date;
  maxVehicles: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string; // Same as Firebase Auth UID
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'active' | 'inactive';
  lastAccess: Date | null;
  role: UserRole;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: string;
  internalName: string;
  economicNumber: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  plates: string;
  color: string;
  vin?: string;
  initialMileage: number;
  status: 'active' | 'inactive' | 'maintenance';
  deviceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ GPS ENTITIES ============

export interface GPSDevice {
  id: string;
  imei: string;
  simNumber: string;
  model: string;
  manufacturer: string;
  protocol: 'tk103' | 'coban' | 'custom';
  status: 'online' | 'offline' | 'inactive';
  vehicleId?: string;
  lastConnection: Date | null;
  firmwareVersion?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GPSPosition {
  deviceId: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  accuracy: number;
  timestamp: Date;
  satellites?: number;
}

export interface GPSTelemetry {
  deviceId: string;
  acc: boolean;
  battery: number;
  voltage: number;
  signalStrength: number;
  temperature?: number;
  fuelLevel?: number;
  mileage?: number;
  timestamp: Date;
}

export interface GPSEvent {
  id: string;
  deviceId: string;
  vehicleId?: string;
  type: 'sos' | 'geofence_enter' | 'geofence_exit' | 'overspeed' | 'low_battery' | 'acc_on' | 'acc_off' | 'vibration' | 'power_cut' | 'custom';
  severity: 'critical' | 'warning' | 'info';
  position: GPSPosition;
  telemetry?: GPSTelemetry;
  description: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  createdAt: Date;
}

export interface GPSCommand {
  id: string;
  deviceId: string;
  command: string;
  parameters?: Record<string, unknown>;
  status: 'pending' | 'sent' | 'acknowledged' | 'failed' | 'timeout';
  response?: string;
  sentAt?: Date;
  respondedAt?: Date;
  createdAt: Date;
}

export interface GPSRoute {
  id: string;
  vehicleId: string;
  deviceId: string;
  name?: string;
  positions: GPSPosition[];
  startTime: Date;
  endTime: Date;
  distance: number;
  maxSpeed: number;
  avgSpeed: number;
  stops: number;
  createdAt: Date;
}

// ============ ALERT ENTITY ============

export interface Alert {
  id: string;
  type: 'geofence' | 'speed' | 'maintenance' | 'battery' | 'sos' | 'custom';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  vehicleId?: string;
  deviceId?: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  createdAt: Date;
}

// ============ SETTINGS ============

export interface CompanySettings {
  id: string;
  speedLimit: number;
  maintenanceInterval: number;
  alertsEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  timezone: string;
  language: string;
  updatedAt: Date;
}

// ============ PLAN LIMITS ============

export const PLAN_LIMITS: Record<string, { vehicles: number; users: number; devices: number }> = {
  Essential: { vehicles: 10, users: 5, devices: 10 },
  Professional: { vehicles: 50, users: 20, devices: 50 },
  Enterprise: { vehicles: 500, users: 100, devices: 500 },
};

// ============ AUTH CONTEXT ============

export interface AuthContextType {
  user: User | null;
  company: Company | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>, companyData: Partial<Company>) => Promise<void>;
  logout: () => Promise<void>;
}

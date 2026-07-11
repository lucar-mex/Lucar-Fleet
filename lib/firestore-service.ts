import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import { Company, User, Vehicle, GPSDevice, GPSEvent, Alert, PLAN_LIMITS } from './types';

// ============ HELPERS ============

const toDate = (val: unknown): Date | null => {
  if (!val) return null;
  if (typeof val === 'object' && val !== null && 'toDate' in val && typeof (val as { toDate: () => Date }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate();
  }
  if (val instanceof Date) return val;
  return new Date(val as string);
};

const toDateRequired = (val: unknown): Date => {
  if (!val) return new Date();
  if (typeof val === 'object' && val !== null && 'toDate' in val && typeof (val as { toDate: () => Date }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate();
  }
  if (val instanceof Date) return val;
  return new Date(val as string);
};

// ============ COMPANIES ============

export const createCompany = async (companyData: Partial<Company>): Promise<string> => {
  const companiesRef = collection(db, 'companies');
  const docRef = doc(companiesRef);
  const company: Company = {
    id: docRef.id,
    name: companyData.name || '',
    legalName: companyData.legalName,
    taxId: companyData.taxId,
    email: companyData.email || '',
    phone: companyData.phone || '',
    address: companyData.address || '',
    plan: companyData.plan || 'Essential',
    status: 'active',
    renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxVehicles: PLAN_LIMITS[companyData.plan || 'Essential'].vehicles,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await setDoc(docRef, company);
  return docRef.id;
};

export const getCompany = async (companyId: string): Promise<Company | null> => {
  const docRef = doc(db, 'companies', companyId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    ...data,
    id: docSnap.id,
    renewalDate: toDateRequired(data.renewalDate),
    createdAt: toDateRequired(data.createdAt),
    updatedAt: toDateRequired(data.updatedAt),
  } as Company;
};

export const updateCompany = async (companyId: string, updates: Partial<Company>): Promise<void> => {
  const docRef = doc(db, 'companies', companyId);
  await updateDoc(docRef, { ...updates, updatedAt: new Date() });
};

// ============ USERS (subcollection of companies) ============

export const createUser = async (companyId: string, uid: string, userData: Partial<User>): Promise<string> => {
  // User document uses Firebase Auth UID as document ID
  const docRef = doc(db, 'companies', companyId, 'users', uid);
  const user: User = {
    id: uid,
    name: userData.name || '',
    email: userData.email || '',
    phone: userData.phone || '',
    position: userData.position || '',
    status: 'active',
    lastAccess: null,
    role: userData.role || 'operator',
    companyId: companyId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await setDoc(docRef, user);
  return uid;
};

export const getUser = async (companyId: string, uid: string): Promise<User | null> => {
  const docRef = doc(db, 'companies', companyId, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    ...data,
    id: docSnap.id,
    lastAccess: toDate(data.lastAccess),
    createdAt: toDateRequired(data.createdAt),
    updatedAt: toDateRequired(data.updatedAt),
  } as User;
};

export const getUserByUID = async (uid: string): Promise<{ user: User; companyId: string } | null> => {
  // Look up the user reference document to find their companyId
  const userRefDoc = doc(db, 'userRefs', uid);
  const userRefSnap = await getDoc(userRefDoc);
  if (!userRefSnap.exists()) return null;
  const { companyId } = userRefSnap.data() as { companyId: string };
  const user = await getUser(companyId, uid);
  if (!user) return null;
  return { user, companyId };
};

export const createUserRef = async (uid: string, companyId: string): Promise<void> => {
  // Auxiliary document to look up a user by UID without knowing the companyId
  const docRef = doc(db, 'userRefs', uid);
  await setDoc(docRef, { companyId, createdAt: new Date() });
};

export const getUsersByCompany = async (companyId: string): Promise<User[]> => {
  const usersRef = collection(db, 'companies', companyId, 'users');
  const querySnapshot = await getDocs(usersRef);
  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      lastAccess: toDate(data.lastAccess),
      createdAt: toDateRequired(data.createdAt),
      updatedAt: toDateRequired(data.updatedAt),
    } as User;
  });
};

export const updateUser = async (companyId: string, uid: string, updates: Partial<User>): Promise<void> => {
  const docRef = doc(db, 'companies', companyId, 'users', uid);
  await updateDoc(docRef, { ...updates, updatedAt: new Date() });
};

export const deleteUser = async (companyId: string, uid: string): Promise<void> => {
  const docRef = doc(db, 'companies', companyId, 'users', uid);
  await deleteDoc(docRef);
  // Also delete the reference
  const refDoc = doc(db, 'userRefs', uid);
  await deleteDoc(refDoc);
};

export const updateLastAccess = async (companyId: string, uid: string): Promise<void> => {
  const docRef = doc(db, 'companies', companyId, 'users', uid);
  await updateDoc(docRef, { lastAccess: new Date() });
};

// ============ VEHICLES (subcollection of companies) ============

export const createVehicle = async (companyId: string, vehicleData: Partial<Vehicle>): Promise<string> => {
  const vehiclesRef = collection(db, 'companies', companyId, 'vehicles');
  const docRef = doc(vehiclesRef);
  const vehicle: Vehicle = {
    id: docRef.id,
    internalName: vehicleData.internalName || '',
    economicNumber: vehicleData.economicNumber || '',
    type: vehicleData.type || '',
    brand: vehicleData.brand || '',
    model: vehicleData.model || '',
    year: vehicleData.year || new Date().getFullYear(),
    plates: vehicleData.plates || '',
    color: vehicleData.color || '',
    vin: vehicleData.vin,
    initialMileage: vehicleData.initialMileage || 0,
    status: 'active',
    deviceId: vehicleData.deviceId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await setDoc(docRef, vehicle);
  return docRef.id;
};

export const getVehicle = async (companyId: string, vehicleId: string): Promise<Vehicle | null> => {
  const docRef = doc(db, 'companies', companyId, 'vehicles', vehicleId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    ...data,
    id: docSnap.id,
    createdAt: toDateRequired(data.createdAt),
    updatedAt: toDateRequired(data.updatedAt),
  } as Vehicle;
};

export const getVehiclesByCompany = async (companyId: string): Promise<Vehicle[]> => {
  const vehiclesRef = collection(db, 'companies', companyId, 'vehicles');
  const querySnapshot = await getDocs(vehiclesRef);
  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      createdAt: toDateRequired(data.createdAt),
      updatedAt: toDateRequired(data.updatedAt),
    } as Vehicle;
  });
};

export const updateVehicle = async (companyId: string, vehicleId: string, updates: Partial<Vehicle>): Promise<void> => {
  const docRef = doc(db, 'companies', companyId, 'vehicles', vehicleId);
  await updateDoc(docRef, { ...updates, updatedAt: new Date() });
};

export const deleteVehicle = async (companyId: string, vehicleId: string): Promise<void> => {
  const docRef = doc(db, 'companies', companyId, 'vehicles', vehicleId);
  await deleteDoc(docRef);
};

export const getVehicleCount = async (companyId: string): Promise<number> => {
  const vehiclesRef = collection(db, 'companies', companyId, 'vehicles');
  const querySnapshot = await getDocs(vehiclesRef);
  return querySnapshot.size;
};

export const getActiveVehicleCount = async (companyId: string): Promise<number> => {
  const vehiclesRef = collection(db, 'companies', companyId, 'vehicles');
  const q = query(vehiclesRef, where('status', '==', 'active'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

// ============ GPS DEVICES (subcollection of companies) ============

export const createDevice = async (companyId: string, deviceData: Partial<GPSDevice>): Promise<string> => {
  const devicesRef = collection(db, 'companies', companyId, 'devices');
  const docRef = doc(devicesRef);
  const device: GPSDevice = {
    id: docRef.id,
    imei: deviceData.imei || '',
    simNumber: deviceData.simNumber || '',
    model: deviceData.model || '',
    manufacturer: deviceData.manufacturer || '',
    protocol: deviceData.protocol || 'tk103',
    status: 'inactive',
    vehicleId: deviceData.vehicleId,
    lastConnection: null,
    firmwareVersion: deviceData.firmwareVersion,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await setDoc(docRef, device);
  return docRef.id;
};

export const getDevicesByCompany = async (companyId: string): Promise<GPSDevice[]> => {
  const devicesRef = collection(db, 'companies', companyId, 'devices');
  const querySnapshot = await getDocs(devicesRef);
  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      lastConnection: toDate(data.lastConnection),
      createdAt: toDateRequired(data.createdAt),
      updatedAt: toDateRequired(data.updatedAt),
    } as GPSDevice;
  });
};

export const updateDevice = async (companyId: string, deviceId: string, updates: Partial<GPSDevice>): Promise<void> => {
  const docRef = doc(db, 'companies', companyId, 'devices', deviceId);
  await updateDoc(docRef, { ...updates, updatedAt: new Date() });
};

export const deleteDevice = async (companyId: string, deviceId: string): Promise<void> => {
  const docRef = doc(db, 'companies', companyId, 'devices', deviceId);
  await deleteDoc(docRef);
};

// ============ EVENTS (subcollection of companies) ============

export const getEventsByCompany = async (companyId: string, limitCount: number = 50): Promise<GPSEvent[]> => {
  const eventsRef = collection(db, 'companies', companyId, 'events');
  const q = query(eventsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      createdAt: toDateRequired(data.createdAt),
    } as GPSEvent;
  });
};

// ============ ALERTS (subcollection of companies) ============

export const getAlertsByCompany = async (companyId: string, limitCount: number = 50): Promise<Alert[]> => {
  const alertsRef = collection(db, 'companies', companyId, 'alerts');
  const q = query(alertsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      createdAt: toDateRequired(data.createdAt),
    } as Alert;
  });
};

export const acknowledgeAlert = async (companyId: string, alertId: string, userId: string): Promise<void> => {
  const docRef = doc(db, 'companies', companyId, 'alerts', alertId);
  await updateDoc(docRef, {
    acknowledged: true,
    acknowledgedBy: userId,
    acknowledgedAt: new Date(),
  });
};

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
  Query,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Empresa, Usuario, Vehiculo, PLAN_LIMITS } from './types';

// ============ EMPRESAS (Companies) ============

export const createEmpresa = async (empresaData: Partial<Empresa>): Promise<string> => {
  const empresasRef = collection(db, 'empresas');
  const docRef = doc(empresasRef);
  
  const empresa: Empresa = {
    id: docRef.id,
    nombre: empresaData.nombre || '',
    razonSocial: empresaData.razonSocial,
    rfc: empresaData.rfc,
    correo: empresaData.correo || '',
    telefono: empresaData.telefono || '',
    direccion: empresaData.direccion || '',
    planActual: empresaData.planActual || 'Essential',
    fechaAlta: new Date(),
    estado: 'Activo',
    fechaRenovacion: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxVehiculos: PLAN_LIMITS[empresaData.planActual || 'Essential'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(docRef, empresa);
  return docRef.id;
};

export const getEmpresa = async (empresaID: string): Promise<Empresa | null> => {
  const docRef = doc(db, 'empresas', empresaID);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  return {
    ...data,
    fechaAlta: data.fechaAlta?.toDate?.() || new Date(data.fechaAlta),
    fechaRenovacion: data.fechaRenovacion?.toDate?.() || new Date(data.fechaRenovacion),
    createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
  } as Empresa;
};

export const updateEmpresa = async (empresaID: string, updates: Partial<Empresa>): Promise<void> => {
  const docRef = doc(db, 'empresas', empresaID);
  await updateDoc(docRef, { ...updates, updatedAt: new Date() });
};

export const deleteEmpresa = async (empresaID: string): Promise<void> => {
  const docRef = doc(db, 'empresas', empresaID);
  await deleteDoc(docRef);
};

// ============ USUARIOS (Users) ============

export const createUsuario = async (usuarioData: Partial<Usuario>): Promise<string> => {
  const usuariosRef = collection(db, 'usuarios');
  const docRef = doc(usuariosRef);
  
  const usuario: Usuario = {
    id: docRef.id,
    nombre: usuarioData.nombre || '',
    correo: usuarioData.correo || '',
    telefono: usuarioData.telefono || '',
    cargo: usuarioData.cargo || '',
    estado: 'Activo',
    ultimoAcceso: null,
    rol: usuarioData.rol || 'Operador',
    empresaID: usuarioData.empresaID || '',
    uid: usuarioData.uid || '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(docRef, usuario);
  return docRef.id;
};

export const getUsuario = async (usuarioID: string): Promise<Usuario | null> => {
  const docRef = doc(db, 'usuarios', usuarioID);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  return {
    ...data,
    ultimoAcceso: data.ultimoAcceso?.toDate?.() || null,
    createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
  } as Usuario;
};

export const getUsuarioByUID = async (uid: string): Promise<Usuario | null> => {
  const usuariosRef = collection(db, 'usuarios');
  const q = query(usuariosRef, where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  
  const data = querySnapshot.docs[0].data();
  return {
    ...data,
    ultimoAcceso: data.ultimoAcceso?.toDate?.() || null,
    createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
  } as Usuario;
};

export const getUsuariosByEmpresa = async (empresaID: string): Promise<Usuario[]> => {
  const usuariosRef = collection(db, 'usuarios');
  const q = query(usuariosRef, where('empresaID', '==', empresaID));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      ultimoAcceso: data.ultimoAcceso?.toDate?.() || null,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
    } as Usuario;
  });
};

export const updateUsuario = async (usuarioID: string, updates: Partial<Usuario>): Promise<void> => {
  const docRef = doc(db, 'usuarios', usuarioID);
  await updateDoc(docRef, { ...updates, updatedAt: new Date() });
};

export const deleteUsuario = async (usuarioID: string): Promise<void> => {
  const docRef = doc(db, 'usuarios', usuarioID);
  await deleteDoc(docRef);
};

export const updateUltimoAcceso = async (usuarioID: string): Promise<void> => {
  const docRef = doc(db, 'usuarios', usuarioID);
  await updateDoc(docRef, { ultimoAcceso: new Date() });
};

// ============ VEHICULOS (Vehicles) ============

export const createVehiculo = async (vehiculoData: Partial<Vehiculo>): Promise<string> => {
  const vehiculosRef = collection(db, 'vehiculos');
  const docRef = doc(vehiculosRef);
  
  const vehiculo: Vehiculo = {
    id: docRef.id,
    nombreInterno: vehiculoData.nombreInterno || '',
    numeroEconomico: vehiculoData.numeroEconomico || '',
    tipoVehiculo: vehiculoData.tipoVehiculo || '',
    marca: vehiculoData.marca || '',
    modelo: vehiculoData.modelo || '',
    año: vehiculoData.año || new Date().getFullYear(),
    placas: vehiculoData.placas || '',
    color: vehiculoData.color || '',
    vin: vehiculoData.vin,
    kilometrajeInicial: vehiculoData.kilometrajeInicial || 0,
    estado: 'Activo',
    empresaID: vehiculoData.empresaID || '',
    gpsID: vehiculoData.gpsID,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(docRef, vehiculo);
  return docRef.id;
};

export const getVehiculo = async (vehiculoID: string): Promise<Vehiculo | null> => {
  const docRef = doc(db, 'vehiculos', vehiculoID);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
  } as Vehiculo;
};

export const getVehiculosByEmpresa = async (empresaID: string): Promise<Vehiculo[]> => {
  const vehiculosRef = collection(db, 'vehiculos');
  const q = query(vehiculosRef, where('empresaID', '==', empresaID));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
    } as Vehiculo;
  });
};

export const updateVehiculo = async (vehiculoID: string, updates: Partial<Vehiculo>): Promise<void> => {
  const docRef = doc(db, 'vehiculos', vehiculoID);
  await updateDoc(docRef, { ...updates, updatedAt: new Date() });
};

export const deleteVehiculo = async (vehiculoID: string): Promise<void> => {
  const docRef = doc(db, 'vehiculos', vehiculoID);
  await deleteDoc(docRef);
};

export const getVehiculoCountByEmpresa = async (empresaID: string): Promise<number> => {
  const vehiculosRef = collection(db, 'vehiculos');
  const q = query(vehiculosRef, where('empresaID', '==', empresaID));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

export const getVehiculosActivosByEmpresa = async (empresaID: string): Promise<number> => {
  const vehiculosRef = collection(db, 'vehiculos');
  const q = query(
    vehiculosRef,
    where('empresaID', '==', empresaID),
    where('estado', '==', 'Activo')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

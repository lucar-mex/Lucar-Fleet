# LuCar Fleet - Database Schema

## Firestore Structure

LuCar Fleet uses Firestore as its NoSQL database. All data is organized by collections and documents with the following structure.

## Collections

### 1. empresas (Companies)

**Collection Path**: `/empresas/{empresaID}`

**Document Structure**:
```typescript
{
  id: string;                                    // Document ID (auto-generated)
  nombre: string;                                // Commercial name (required)
  razonSocial?: string;                          // Legal name (optional)
  rfc?: string;                                  // Tax ID (optional)
  correo: string;                                // Email (required)
  telefono: string;                              // Phone (required)
  direccion: string;                             // Address (required)
  planActual: 'Essential' | 'Professional' | 'Enterprise'; // Current plan
  fechaAlta: Timestamp;                          // Registration date
  estado: 'Activo' | 'Suspendido' | 'Cancelado'; // Status
  fechaRenovacion: Timestamp;                    // Next renewal date
  maxVehiculos: number;                          // Max vehicles allowed (10/50/500)
  createdAt: Timestamp;                          // Creation timestamp
  updatedAt: Timestamp;                          // Last update timestamp
}
```

**Indexes**:
- `estado` (ascending)
- `planActual` (ascending)
- `fechaRenovacion` (ascending)

**Security Rules**:
- Read: Only users from same company
- Create: Any authenticated user
- Update: Only Propietario
- Delete: Only Propietario

**Queries**:
```typescript
// Get all active companies
query(empresasRef, where('estado', '==', 'Activo'))

// Get companies by plan
query(empresasRef, where('planActual', '==', 'Professional'))

// Get companies expiring soon
query(empresasRef, where('fechaRenovacion', '<', Date.now()))
```

---

### 2. usuarios (Users)

**Collection Path**: `/usuarios/{usuarioID}`

**Document Structure**:
```typescript
{
  id: string;                                    // Document ID (auto-generated)
  nombre: string;                                // Full name (required)
  correo: string;                                // Email (required)
  telefono: string;                              // Phone (optional)
  cargo: string;                                 // Job title (required)
  estado: 'Activo' | 'Inactivo';                // Status
  ultimoAcceso: Timestamp | null;                // Last login timestamp
  rol: 'Propietario' | 'Administrador' | 'Supervisor' | 'Operador'; // Role
  empresaID: string;                             // Company ID (required, foreign key)
  uid: string;                                   // Firebase UID (required)
  createdAt: Timestamp;                          // Creation timestamp
  updatedAt: Timestamp;                          // Last update timestamp
}
```

**Indexes**:
- `empresaID` (ascending)
- `rol` (ascending)
- `estado` (ascending)
- `empresaID` + `rol` (composite)

**Security Rules**:
- Read: User can read own document or company members
- Create: Any authenticated user
- Update: User can update own, Propietario/Administrador can update others
- Delete: Only Propietario/Administrador

**Queries**:
```typescript
// Get all users in company
query(usuariosRef, where('empresaID', '==', empresaID))

// Get all admins in company
query(usuariosRef, where('empresaID', '==', empresaID), where('rol', '==', 'Administrador'))

// Get active users
query(usuariosRef, where('empresaID', '==', empresaID), where('estado', '==', 'Activo'))

// Get user by Firebase UID
query(usuariosRef, where('uid', '==', firebaseUID))
```

---

### 3. vehiculos (Vehicles)

**Collection Path**: `/vehiculos/{vehiculoID}`

**Document Structure**:
```typescript
{
  id: string;                                    // Document ID (auto-generated)
  nombreInterno: string;                         // Internal name (required)
  numeroEconomico: string;                       // Fleet number (required)
  tipoVehiculo: string;                          // Type: Camión, Auto, etc. (required)
  marca: string;                                 // Brand: Toyota, Ford, etc. (required)
  modelo: string;                                // Model: Hilux, F-150, etc. (required)
  año: number;                                   // Year (required)
  placas: string;                                // License plate (required)
  color: string;                                 // Color (optional)
  vin?: string;                                  // VIN number (optional)
  kilometrajeInicial: number;                    // Initial mileage (optional, default 0)
  estado: 'Activo' | 'Inactivo' | 'Mantenimiento'; // Status
  empresaID: string;                             // Company ID (required, foreign key)
  gpsID?: string;                                // GPS device ID (optional, for future use)
  createdAt: Timestamp;                          // Creation timestamp
  updatedAt: Timestamp;                          // Last update timestamp
}
```

**Indexes**:
- `empresaID` (ascending)
- `estado` (ascending)
- `placas` (ascending)
- `empresaID` + `estado` (composite)
- `empresaID` + `createdAt` (composite)

**Security Rules**:
- Read: Only users from same company
- Create: Supervisor+ role
- Update: Supervisor+ role
- Delete: Administrador+ role

**Queries**:
```typescript
// Get all vehicles in company
query(vehiculosRef, where('empresaID', '==', empresaID))

// Get active vehicles
query(vehiculosRef, where('empresaID', '==', empresaID), where('estado', '==', 'Activo'))

// Get vehicles in maintenance
query(vehiculosRef, where('empresaID', '==', empresaID), where('estado', '==', 'Mantenimiento'))

// Get vehicle by plate
query(vehiculosRef, where('placas', '==', 'ABC-1234'))

// Get vehicles by type
query(vehiculosRef, where('empresaID', '==', empresaID), where('tipoVehiculo', '==', 'Camión'))
```

---

## Data Relationships

### Empresa → Usuarios
- One empresa has many usuarios
- Foreign key: `usuarios.empresaID`
- Relationship: 1:N

### Empresa → Vehiculos
- One empresa has many vehiculos
- Foreign key: `vehiculos.empresaID`
- Relationship: 1:N

### Usuario → Empresa
- Many usuarios belong to one empresa
- Foreign key: `usuarios.empresaID`
- Relationship: N:1

### Usuario → Firebase Auth
- Each usuario has a Firebase UID
- Field: `usuarios.uid`
- Relationship: 1:1

---

## Composite Indexes

Firestore requires composite indexes for queries with multiple conditions.

**Required Indexes**:

1. **usuarios collection**
   - Fields: `empresaID` (Asc), `rol` (Asc)
   - Query: Get all users of specific role in company

2. **vehiculos collection**
   - Fields: `empresaID` (Asc), `estado` (Asc)
   - Query: Get active/inactive vehicles

3. **vehiculos collection**
   - Fields: `empresaID` (Asc), `createdAt` (Desc)
   - Query: Get recent vehicles

---

## Data Isolation Strategy

### Multi-Tenancy
- All queries filter by `empresaID`
- Firestore Security Rules enforce `empresaID` checks
- Frontend always includes `empresaID` in queries
- No cross-company data access possible

### Example:
```typescript
// Always filter by empresaID
const q = query(
  vehiculosRef,
  where('empresaID', '==', user.empresaID),
  where('estado', '==', 'Activo')
);
```

---

## Query Performance

### Efficient Queries
- Always include `empresaID` in WHERE clause
- Use indexed fields for filtering
- Limit results with pagination (future)
- Avoid full collection scans

### Slow Queries (Avoid)
```typescript
// ❌ BAD: Full collection scan
const allVehicles = await getDocs(collection(db, 'vehiculos'));

// ✅ GOOD: Filtered by company
const companyVehicles = await getDocs(
  query(vehiculosRef, where('empresaID', '==', empresaID))
);
```

---

## Backup & Recovery

- Firestore automatic backups (handled by Firebase)
- Point-in-time recovery available
- Export data via Firebase Console
- No manual backup needed

---

## Scalability

### Current Limits
- Essential plan: 10 vehicles
- Professional plan: 50 vehicles
- Enterprise plan: 500 vehicles

### Firestore Limits
- Document size: 1 MB
- Collection size: Unlimited
- Read operations: 50,000/day (free tier)
- Write operations: 20,000/day (free tier)

### Optimization
- Use pagination for large datasets
- Archive old records
- Use Cloud Firestore export for analytics
- Consider sharding for very large collections

---

## Data Validation

### Frontend Validation
- TypeScript interfaces enforce types
- Input validation in forms
- Required field checks

### Backend Validation (Firestore Rules)
- empresaID must match user's company
- Role-based access control
- Data type validation
- Required fields enforcement

---

## Migration & Upgrades

### Plan Upgrades
```typescript
// When upgrading from Essential (10) to Professional (50)
await updateEmpresa(empresaID, {
  planActual: 'Professional',
  maxVehiculos: 50,
  fechaRenovacion: newDate
});
```

### User Role Changes
```typescript
// Change user role
await updateUsuario(usuarioID, {
  rol: 'Administrador'
});
```

---

## Future Enhancements

### GPS Integration
- Add `gpsID` field to vehiculos
- Create `gps_locations` collection for tracking
- Real-time location updates

### Maintenance Tracking
- Create `mantenimiento` collection
- Link to vehiculos via `vehiculoID`
- Track maintenance history

### Fuel Management
- Create `combustible` collection
- Track fuel consumption
- Calculate costs

### Driver Management
- Create `conductores` collection
- Link to usuarios
- Track driver performance

### Trip Tracking
- Create `viajes` collection
- Link vehiculos and conductores
- Track routes and times

---

## Database Monitoring

### Metrics to Track
- Collection sizes
- Query performance
- Storage usage
- Read/write operations
- Security rule violations

### Firebase Console
- Real-time monitoring available
- Usage statistics
- Performance insights
- Security alerts

---

## Compliance

### GDPR Compliance
- User data can be exported
- User data can be deleted
- Data retention policies
- Privacy controls

### Data Encryption
- In transit: HTTPS
- At rest: Firebase handles
- Backup encryption: Automatic

---

## Best Practices

1. **Always filter by empresaID** - Prevents cross-tenant data access
2. **Use indexed fields** - Improves query performance
3. **Validate on backend** - Security rules enforce data integrity
4. **Paginate large results** - Improves performance
5. **Archive old data** - Reduces collection size
6. **Monitor usage** - Track storage and operations
7. **Regular backups** - Export data periodically
8. **Test security rules** - Verify access control

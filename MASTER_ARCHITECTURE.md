# LuCar Fleet - Master Architecture

## Overview

LuCar Fleet is a multi-tenant fleet management system built with Next.js, React, TypeScript, TailwindCSS, Firebase Authentication, and Firestore. The system is designed to support multiple companies with complete data isolation and role-based access control.

## Tech Stack

- **Frontend**: Next.js 16+ (App Router), React 19, TypeScript 5.9
- **Styling**: TailwindCSS 4.3, custom CSS
- **State Management**: Zustand 5.0
- **Backend/Database**: Firebase (Auth + Firestore)
- **Deployment**: Vercel
- **Package Manager**: pnpm

## Architecture Principles

### 1. Multi-Tenancy
- Each company (Empresa) is a separate tenant
- All data is isolated by `empresaID`
- Users can only access data from their company
- Enforced at both frontend and Firestore security rules level

### 2. Role-Based Access Control (RBAC)
- Four roles: Propietario, Administrador, Supervisor, Operador
- Each role has specific permissions
- Permissions are checked before rendering UI components
- Backend security rules enforce role-based access

### 3. Security
- Firebase Authentication for user authentication
- Firestore Security Rules for data access control
- No sensitive data in frontend code
- Environment variables for Firebase config
- UID-based user identification

### 4. Clean Architecture
- Separation of concerns: UI, Business Logic, Data Layer
- Reusable components with TypeScript interfaces
- Service layer for Firestore operations
- Store layer for state management

## Directory Structure

```
lucar-fleet/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── login/page.tsx           # Login page
│   ├── register/page.tsx        # Registration page
│   ├── dashboard/page.tsx       # Dashboard with real Firestore data
│   ├── companies/page.tsx       # Company management
│   ├── users/page.tsx           # User management
│   ├── vehicles/page.tsx        # Vehicle management
│   ├── profile/page.tsx         # User profile
│   ├── settings/page.tsx        # Settings page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── Layout.tsx               # Main layout with sidebar
│   ├── ProtectedRoute.tsx       # Route protection component
│   └── ui/
│       ├── Button.tsx           # Reusable button
│       ├── Input.tsx            # Reusable input
│       ├── Card.tsx             # Card components
│       ├── Badge.tsx            # Badge component
│       └── Modal.tsx            # Modal component
├── lib/
│   ├── firebase.ts              # Firebase initialization
│   ├── types.ts                 # TypeScript interfaces
│   ├── auth-store.ts            # Zustand auth store
│   ├── rbac.ts                  # Role-based access control
│   └── firestore-service.ts     # Firestore CRUD operations
├── .env.local                   # Firebase configuration
├── firestore.rules              # Firestore security rules
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # TailwindCSS configuration
└── package.json                 # Dependencies
```

## Data Flow

### Authentication Flow
1. User submits login/register form
2. Firebase Auth creates/authenticates user
3. User record created in Firestore with UID
4. Zustand store updated with user data
5. User redirected to dashboard

### Data Access Flow
1. Component requests data from Firestore service
2. Service layer queries Firestore with empresaID filter
3. Firestore security rules validate user access
4. Data returned to component
5. Component renders with real data

### State Management
- Zustand store manages auth state (user, empresa, loading, error)
- Component-level state for forms and UI
- No Redux or Context API complexity

## Key Features

### 1. Multi-Company System
- Each company has:
  - Nombre (commercial name)
  - Razón Social (optional)
  - RFC (optional)
  - Contact info (email, phone, address)
  - Plan (Essential/Professional/Enterprise)
  - Max vehicles based on plan
  - Status (Activo/Suspendido/Cancelado)
  - Renewal date

### 2. User Management
- Each user belongs to one company
- Roles: Propietario, Administrador, Supervisor, Operador
- Fields: nombre, correo, telefono, cargo, estado, ultimoAcceso, rol
- First user of company is automatically Propietario

### 3. Vehicle Management
- Full CRUD operations
- Fields: nombreInterno, numeroEconomico, tipoVehiculo, marca, modelo, año, placas, color, VIN, kilometrajeInicial, estado
- Prepared for GPS integration (gpsID field)
- Status: Activo, Inactivo, Mantenimiento

### 4. Dashboard
- Real-time data from Firestore
- Metrics: total vehicles, active vehicles, users, plan status
- Next renewal date
- Capacity usage percentage
- Recent vehicles table

### 5. Professional UI
- Dark theme throughout
- Responsive design (mobile, tablet, desktop)
- Sidebar navigation with collapsible menu
- Loading spinners and error states
- Empty states for no data
- Confirmation dialogs for destructive actions
- Spanish language throughout

## Firestore Collections

### empresas
```
{
  id: string,
  nombre: string,
  razonSocial?: string,
  rfc?: string,
  correo: string,
  telefono: string,
  direccion: string,
  planActual: 'Essential' | 'Professional' | 'Enterprise',
  fechaAlta: Date,
  estado: 'Activo' | 'Suspendido' | 'Cancelado',
  fechaRenovacion: Date,
  maxVehiculos: number,
  createdAt: Date,
  updatedAt: Date
}
```

### usuarios
```
{
  id: string,
  nombre: string,
  correo: string,
  telefono: string,
  cargo: string,
  estado: 'Activo' | 'Inactivo',
  ultimoAcceso: Date | null,
  rol: 'Propietario' | 'Administrador' | 'Supervisor' | 'Operador',
  empresaID: string,
  uid: string (Firebase UID),
  createdAt: Date,
  updatedAt: Date
}
```

### vehiculos
```
{
  id: string,
  nombreInterno: string,
  numeroEconomico: string,
  tipoVehiculo: string,
  marca: string,
  modelo: string,
  año: number,
  placas: string,
  color: string,
  vin?: string,
  kilometrajeInicial: number,
  estado: 'Activo' | 'Inactivo' | 'Mantenimiento',
  empresaID: string,
  gpsID?: string (for future GPS integration),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Rules

- **empresas**: Only users from same company can read. Only Propietario can update/delete.
- **usuarios**: Users can read/update their own document or company members. Only Propietario/Administrador can delete.
- **vehiculos**: Only users from same company can read. Supervisor+ can update. Administrador+ can delete.

## Role Permissions

### Propietario
- view_dashboard
- manage_company
- manage_users
- manage_vehicles
- view_reports
- manage_settings
- invite_users
- delete_users

### Administrador
- view_dashboard
- manage_users
- manage_vehicles
- view_reports
- manage_settings
- invite_users

### Supervisor
- view_dashboard
- view_users
- manage_vehicles
- view_reports

### Operador
- view_dashboard
- view_vehicles

## Future Integrations (Prepared)

The architecture is prepared for:
- **GPS Integration**: `gpsID` field in vehicles for GPS device association
- **Maps Integration**: Ready for Google Maps API
- **Payments**: Plan upgrade/downgrade flow
- **Billing**: Invoice generation and payment processing
- **AI**: Machine learning for vehicle maintenance predictions
- **TCP Server**: Real-time vehicle tracking
- **Mobile App**: React Native app using same backend

## Performance Considerations

- Efficient Firestore queries with empresaID filter
- Composite indexes for complex queries
- Lazy loading of data
- Pagination ready (not implemented yet)
- Caching at component level
- Optimized re-renders with React 19

## Deployment

- Hosted on Vercel
- Firebase backend (serverless)
- Environment variables for Firebase config
- No server-side code needed
- Automatic deployments on git push

## Development Workflow

1. Clone repository
2. Install dependencies: `pnpm install`
3. Create `.env.local` with Firebase config
4. Run dev server: `pnpm dev`
5. Open http://localhost:3000
6. Make changes and commit
7. Push to GitHub for automatic deployment

## Testing Strategy (Future)

- Unit tests for utility functions
- Component tests with React Testing Library
- E2E tests with Playwright
- Firebase emulator for local testing

## Monitoring & Analytics

- Firebase Analytics (configured but not implemented)
- Error tracking (ready for Sentry integration)
- Performance monitoring (ready for Web Vitals)

## Compliance & Standards

- GDPR ready (user data can be exported/deleted)
- Data isolation by tenant
- Audit logs ready (not implemented)
- Encryption in transit (HTTPS)
- Encryption at rest (Firebase handles)

## Known Limitations

- No offline support yet
- No real-time updates (can be added with Firestore listeners)
- No file uploads (ready for Cloud Storage)
- No email notifications (ready for Cloud Functions)
- No SMS support
- No video/audio features

## Next Steps for Sprint 3

1. Real-time data updates with Firestore listeners
2. Advanced reporting and analytics
3. GPS tracking integration
4. Mobile app (React Native)
5. Email notifications
6. Payment processing
7. Advanced search and filtering
8. Bulk operations
9. Audit logging
10. API for third-party integrations

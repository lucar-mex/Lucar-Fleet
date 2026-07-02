# LuCar Fleet - Fleet Management System

**Sprint 2 (Beta)** - Sistema de gestión de flotas vehiculares con soporte multi-empresa, control de acceso basado en roles y operaciones CRUD en tiempo real.

## 🚀 Características Principales

- **Multi-Empresa**: Gestiona múltiples empresas con aislamiento de datos completo
- **Gestión de Usuarios**: Roles: Propietario, Administrador, Supervisor, Operador
- **CRUD de Vehículos**: Crear, leer, actualizar y eliminar vehículos
- **Dashboard en Tiempo Real**: Métricas y datos en vivo desde Firestore
- **Seguridad Avanzada**: Firebase Auth + Firestore Security Rules
- **Interfaz Profesional**: Diseño oscuro, completamente responsivo
- **Preparado para Futuras Integraciones**: GPS, Mapas, Pagos, AI

## 📋 Requisitos Previos

- Node.js 18+
- pnpm (recomendado) o npm
- Cuenta de Firebase con proyecto configurado
- Git

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/lucar-mex/Lucar-Fleet.git
cd Lucar-Fleet
```

### 2. Instalar dependencias

```bash
pnpm install
# o
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB5FbPH_fXR8WKeHm49-ysPrGQQnHx74qI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lucar-fleet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lucar-fleet
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lucar-fleet.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=107936124280
NEXT_PUBLIC_FIREBASE_APP_ID=1:107936124280:web:29b56fdb6375359b658c8d
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-X73EEBB5CF
```

### 4. Ejecutar servidor de desarrollo

```bash
pnpm dev
# o
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
lucar-fleet/
├── app/                          # Páginas de Next.js (App Router)
│   ├── page.tsx                  # Landing page
│   ├── login/page.tsx            # Página de login
│   ├── register/page.tsx         # Registro con creación de empresa
│   ├── dashboard/page.tsx        # Dashboard principal
│   ├── companies/page.tsx        # Gestión de empresas
│   ├── users/page.tsx            # Gestión de usuarios
│   ├── vehicles/page.tsx         # Gestión de vehículos
│   ├── profile/page.tsx          # Perfil de usuario
│   ├── settings/page.tsx         # Configuración
│   ├── layout.tsx                # Layout raíz
│   └── globals.css               # Estilos globales
├── components/                   # Componentes React
│   ├── Layout.tsx                # Layout con sidebar
│   ├── ProtectedRoute.tsx        # Protección de rutas
│   └── ui/                       # Componentes UI reutilizables
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── Modal.tsx
├── lib/                          # Utilidades y servicios
│   ├── firebase.ts               # Inicialización de Firebase
│   ├── types.ts                  # Interfaces TypeScript
│   ├── auth-store.ts             # Store de autenticación (Zustand)
│   ├── rbac.ts                   # Control de acceso por roles
│   └── firestore-service.ts      # Operaciones CRUD en Firestore
├── MASTER_ARCHITECTURE.md        # Documentación de arquitectura
├── DATABASE.md                   # Esquema de Firestore
├── PROJECT_STATUS.md             # Estado del proyecto
├── firestore.rules               # Reglas de seguridad de Firestore
├── .env.local                    # Variables de entorno (no commitear)
└── package.json                  # Dependencias
```

## 🔐 Flujo de Autenticación

### Registro (Nuevo Usuario)

1. Usuario ingresa información de la empresa
2. Sistema crea la empresa en Firestore
3. Usuario ingresa información personal
4. Sistema crea usuario Firebase Auth
5. Sistema crea registro de usuario en Firestore con rol "Propietario"
6. Usuario redirigido al dashboard

### Login

1. Usuario ingresa email y contraseña
2. Firebase Auth valida credenciales
3. Sistema carga datos del usuario desde Firestore
4. Zustand store actualizado
5. Usuario redirigido al dashboard

### Logout

1. Usuario hace click en logout
2. Firebase Auth cierra sesión
3. Zustand store limpiado
4. Usuario redirigido a landing page

## 👥 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Propietario** | Ver dashboard, Gestionar empresa, Gestionar usuarios, Gestionar vehículos, Ver reportes, Gestionar configuración, Invitar usuarios, Eliminar usuarios |
| **Administrador** | Ver dashboard, Gestionar usuarios, Gestionar vehículos, Ver reportes, Gestionar configuración, Invitar usuarios |
| **Supervisor** | Ver dashboard, Ver usuarios, Gestionar vehículos, Ver reportes |
| **Operador** | Ver dashboard, Ver vehículos |

## 📊 Colecciones de Firestore

### empresas

Información de empresas registradas.

```typescript
{
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
```

### usuarios

Usuarios del sistema con roles y permisos.

```typescript
{
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  cargo: string;
  estado: 'Activo' | 'Inactivo';
  ultimoAcceso: Date | null;
  rol: 'Propietario' | 'Administrador' | 'Supervisor' | 'Operador';
  empresaID: string;
  uid: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### vehiculos

Vehículos de las empresas.

```typescript
{
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
  gpsID?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔒 Seguridad

- **Aislamiento Multi-Tenant**: Cada empresa solo ve sus datos
- **Firestore Security Rules**: Validación en backend
- **Control de Acceso Basado en Roles**: Permisos granulares
- **Autenticación Firebase**: Segura y escalable
- **HTTPS**: Encriptación en tránsito (Vercel)

## 🚀 Planes

| Plan | Vehículos | Usuarios | Precio |
|------|-----------|----------|--------|
| **Essential** | 10 | 5 | $99/mes |
| **Professional** | 50 | 20 | $299/mes |
| **Enterprise** | 500 | Ilimitado | Contactar |

## 📝 Páginas Disponibles

- **Landing** (`/`) - Página de inicio
- **Login** (`/login`) - Iniciar sesión
- **Registro** (`/register`) - Crear cuenta y empresa
- **Dashboard** (`/dashboard`) - Panel principal (protegido)
- **Empresas** (`/companies`) - Información de empresa (protegido)
- **Usuarios** (`/users`) - Gestión de usuarios (protegido)
- **Vehículos** (`/vehicles`) - Gestión de vehículos (protegido)
- **Perfil** (`/profile`) - Perfil de usuario (protegido)
- **Configuración** (`/settings`) - Configuración de cuenta (protegido)

## 🔧 Comandos Disponibles

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Ejecutar build de producción
pnpm start

# Linting
pnpm lint

# Type checking
pnpm type-check
```

## 📚 Documentación Adicional

- **[MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md)** - Arquitectura completa del sistema
- **[DATABASE.md](./DATABASE.md)** - Esquema de Firestore y relaciones
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Estado actual del proyecto
- **[firestore.rules](./firestore.rules)** - Reglas de seguridad de Firestore

## 🚀 Deployment

### Vercel (Recomendado)

1. Push a GitHub
2. Conectar repositorio en Vercel
3. Configurar variables de entorno
4. Vercel despliega automáticamente

```bash
git push origin main
```

### Variables de Entorno en Vercel

Agregar las mismas variables de `.env.local` en Vercel Dashboard:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## 🔮 Próximas Características (Sprint 3)

- GPS Tracking en tiempo real
- Integración con Google Maps
- Procesamiento de pagos (Stripe)
- Sistema de facturación
- Reportes avanzados
- App móvil (React Native)
- Notificaciones por email
- Auditoría de cambios
- API para integraciones

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor abre un issue en GitHub con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado
- Capturas de pantalla (si aplica)

## 📧 Soporte

Para soporte, contacta a: lucarmultiservicios.5@gmail.com

## 📄 Licencia

Todos los derechos reservados © 2026 LuCar Fleet

## 👨‍💻 Tecnologías Utilizadas

- **Frontend**: Next.js 16, React 19, TypeScript 5.9
- **Styling**: TailwindCSS 4.3
- **Estado**: Zustand 5.0
- **Backend**: Firebase (Auth + Firestore)
- **Deployment**: Vercel
- **Control de Versiones**: Git + GitHub

## 🎯 Roadmap

### Sprint 2 ✅
- [x] Multi-empresa
- [x] Gestión de usuarios con roles
- [x] CRUD de vehículos
- [x] Dashboard en tiempo real
- [x] Seguridad y aislamiento de datos
- [x] Interfaz profesional

### Sprint 3 (Próximo)
- [ ] GPS tracking
- [ ] Google Maps integration
- [ ] Pagos y facturación
- [ ] Reportes avanzados
- [ ] App móvil

---

**Versión**: Sprint 2 (Beta)  
**Última actualización**: Junio 2026  
**Estado**: Listo para producción ✅

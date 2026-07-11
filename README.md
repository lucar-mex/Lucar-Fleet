# LuCar Fleet

Plataforma profesional de gestión de flota vehicular con rastreo GPS, telemetría en tiempo real y gestión multi-empresa.

## Stack Tecnológico

- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Estilos:** Tailwind CSS 4 con Glassmorphism
- **Estado:** Zustand
- **Backend:** Firebase (Firestore + Authentication)
- **Despliegue:** Vercel

## Arquitectura

```
LuCar Fleet
├── app/                    # Páginas (Next.js App Router)
│   ├── dashboard/          # Panel de control
│   ├── login/              # Autenticación
│   ├── register/           # Registro multi-paso
│   ├── vehicles/           # Gestión de vehículos
│   ├── users/              # Gestión de usuarios
│   ├── companies/          # Información de empresa
│   ├── profile/            # Perfil de usuario
│   └── settings/           # Configuración
├── components/             # Componentes reutilizables
│   ├── Layout.tsx          # Layout principal con sidebar
│   ├── ProtectedRoute.tsx  # Protección de rutas
│   └── ui/                 # Sistema de diseño
├── lib/                    # Lógica de negocio
│   ├── firebase.ts         # Configuración Firebase
│   ├── firestore-service.ts # Servicios de datos
│   ├── auth-store.ts       # Estado de autenticación
│   ├── rbac.ts             # Control de acceso por roles
│   └── types.ts            # Tipos TypeScript + GPS
└── firestore.rules         # Reglas de seguridad
```

## Modelo de Datos (Firestore)

```
companies/{companyId}
├── users/{userId}          # userId = Firebase Auth UID
├── vehicles/{vehicleId}
├── devices/{deviceId}      # Dispositivos GPS
├── events/{eventId}        # Eventos GPS
├── routes/{routeId}        # Rutas
├── alerts/{alertId}        # Alertas
└── settings/{settingId}    # Configuración

userRefs/{uid}              # Referencia rápida UID → companyId
```

## Roles de Usuario

| Rol | Permisos |
|-----|----------|
| Owner | Acceso total, gestión de empresa |
| Admin | Gestión de usuarios, vehículos, dispositivos |
| Supervisor | Vehículos, dispositivos, reportes |
| Operator | Vista de dashboard y vehículos |

## Arquitectura GPS (Preparada)

```
GPS Device → TCP Server → Protocol Decoder → Event Processor → Firestore → Dashboard → Fleet AI
```

Interfaces TypeScript definidas para:
- `GPSDevice` - Dispositivos de rastreo
- `GPSPosition` - Posiciones geográficas
- `GPSTelemetry` - Datos de telemetría
- `GPSEvent` - Eventos del dispositivo
- `GPSCommand` - Comandos remotos
- `GPSRoute` - Rutas registradas

Protocolo compatible: TK103/Coban

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Variables de Entorno

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Licencia

Propietario: LuCar Fleet © 2026

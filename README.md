<div align="center">

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
<img src="https://img.shields.io/badge/Zustand-FF6B35?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" />

<br/><br/>

```
  ____         __ _   ____                _         ____   ___  ____
 / ___|  ___  / _| |_/ ___|_ __ ___  __ _| |_ ___  |  _ \ / _ \/ ___|
 \___ \ / _ \| |_| __| |   | '__/ _ \/ _` | __/ _ \ | |_) | | | \___ \
  ___) | (_) |  _| |_| |___| | |  __/ (_| | ||  __/ |  __/| |_| |___) |
 |____/ \___/|_|  \__|\____|_|  \___|\__,_|\__\___| |_|    \___/|____/
```

### Sistema de Punto de Venta Moderno · Modular · Escalable

*Gestión de ventas, inventario, clientes y cajas desde una sola interfaz web*

<br/>

[![Estado](https://img.shields.io/badge/Estado-En%20Producción-brightgreen?style=flat-square)](.)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-blue?style=flat-square)](.)
[![Versión](https://img.shields.io/badge/Versión-1.0.0-purple?style=flat-square)](.)

</div>

---

## ✦ ¿Qué es SoftCreate POS?

**SoftCreate POS** es una solución de punto de venta diseñada para pequeñas y medianas empresas que necesitan control total sobre sus operaciones comerciales. Combina una interfaz web moderna con un microservicio de impresión local, logrando la flexibilidad de la nube con la velocidad de un sistema local.

```
┌─────────────────────────────────────────────────────────────┐
│                        SOFTCREATE POS                       │
│                                                             │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐              │
│   │   POS    │   │Dashboard │   │Productos │              │
│   │ Ventas   │   │Métricas  │   │Inventario│              │
│   └──────────┘   └──────────┘   └──────────┘              │
│                                                             │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐              │
│   │Clientes  │   │Sucursales│   │Impresoras│              │
│   │Proveed.  │   │  Cajas   │   │ Térmica  │              │
│   └──────────┘   └──────────┘   └──────────┘              │
│                                                             │
│              [ Supabase · Zustand · React ]                 │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Stack Tecnológico

| Capa | Tecnología | Rol |
|------|-----------|-----|
| **Frontend** | React 18 + Vite | UI y bundler de alta velocidad |
| **Base de datos** | Supabase (PostgreSQL) | DB, Auth y Storage en la nube |
| **Estado global** | Zustand | Stores por módulo, ligeros y sin boilerplate |
| **Caché & Fetching** | TanStack Query | Sincronización y caché automática de datos |
| **Estilos** | Styled Components | Temas dinámicos (claro/oscuro) |
| **Enrutamiento** | React Router DOM | Rutas protegidas por rol |
| **Notificaciones** | Sonner | Toast elegantes y no intrusivos |
| **Impresión** | ASP.NET Core (NET 8) | Microservicio de impresión térmica local |
| **PDF** | FreeSpire.PDF | Impresión directa sin diálogos del SO |

---

## 🗂️ Arquitectura

El proyecto aplica **Atomic Design** combinado con separación por responsabilidad. Cada capa tiene un rol claro y no invade la siguiente.

```
src/
├── assets/                  # Recursos estáticos
├── components/
│   ├── atomos/              # Icono, Título, Línea — sin dependencias internas
│   ├── moleculas/           # Btn1, Spinner, ImageContent
│   ├── organismos/          # Bloques de negocio por módulo
│   │   ├── DashboardDesign/
│   │   ├── POSDesign/
│   │   ├── SucursalesDesign/
│   │   ├── formularios/
│   │   ├── sidebar/
│   │   └── tablas/
│   ├── templates/           # Layouts de página completos
│   └── ui/                  # Botones, listas, toggles reutilizables
│       ├── animated/
│       ├── buttons/
│       ├── lists/
│       └── toggles/
├── context/                 # AuthContext con Supabase Auth
├── hooks/                   # Hooks personalizados
├── pages/                   # Una página = una línea de código
├── reports/                 # Tickets y reportes PDF
├── routers/                 # Rutas protegidas
├── store/                   # Stores Zustand por módulo
├── styles/                  # Temas, variables, keyframes
├── supabase/                # Cliente + queries por tabla
└── utils/                   # Funciones utilitarias
```

> **Pages** son intencionalmente mínimas. Una página = un template:
> ```jsx
> export const Empresa = () => <EmpresaTemplate />;
> ```

---

## 📦 Módulos

<table>
<tr>
<td width="50%">

### 🛒 POS — Punto de Venta
Carrito de compras, aplicación de descuentos, selección de método de pago e impresión de ticket al instante.

### 📊 Dashboard
Resumen de ventas del día, métricas por período y acceso rápido a las operaciones más frecuentes.

### 📦 Productos
CRUD completo con soporte de categorías, marcas, imágenes en Supabase Storage y control de precios.

### 👥 Clientes & Proveedores
Gestión de terceros con historial de transacciones y datos de contacto centralizados.

</td>
<td width="50%">

### 💳 Métodos de Pago
Configuración de formas de pago con nombre, ícono personalizado y estado activo/inactivo.

### 🏢 Sucursales & Cajas
Asignación de cajas por sucursal, apertura y cierre de turno con registro de movimientos.

### 🖨️ Impresoras Térmicas
Configuración de impresoras por caja con prueba de impresión y detección automática por red local.

### 🏭 Empresa
Configuración general: nombre, logo, moneda, datos fiscales y parámetros del sistema.

</td>
</tr>
</table>

---

## 🐻 Gestión de Estado — Zustand

Cada módulo tiene su propio store en `src/store/`, desacoplado del resto. Los stores encapsulan las llamadas a Supabase y se combinan con **TanStack Query** para caché e invalidación automática.

```js
// Ejemplo: src/store/empresaStore.js
export const useEmpresaStore = create((set) => ({
  dataempresa: [],

  mostrarempresa: async (idUsuario) => {
    const response = await MostrarEmpresaXidusuario(idUsuario);
    set({ dataempresa: response });
    return response;
  },

  editarEmpresa: async (data, logoAnterior, logoNuevo) => {
    await EditarEmpresa(data, logoAnterior, logoNuevo);
  },
}));
```

---

## 🔌 Supabase — Tiempo Real

El hook `useSupabaseSubscription` escucha cambios en la base de datos e invalida automáticamente la caché de TanStack Query, manteniendo la UI siempre sincronizada sin recargar.

```
Cliente React
     │
     ├──► Supabase Realtime ──► Cambio en DB ──► Invalida caché TanStack Query
     │
     └──► Supabase Storage  ──► imagenes/empresa/{id}
                                imagenes/metodospago/{id}
```

---

## 🖨️ Microservicio de Impresión

Servicio local en **ASP.NET Core NET 8** instalado como Windows Service en el equipo del cajero. Permite imprimir tickets en impresoras térmicas **sin ningún diálogo del sistema operativo**.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/list` | Lista impresoras instaladas en el PC |
| `GET` | `/api/pc` | Retorna nombre del equipo e IP local |
| `POST` | `/api/print_ticket` | Recibe un PDF base64 y lo imprime directamente |

```
POS Web App ──► POST /api/print_ticket ──► Windows Service ──► 🖨️ Impresora Térmica
                      (PDF base64)            (ASP.NET 8)         (sin diálogos)
```

---

## 🔐 Autenticación & Rutas Protegidas

- Login con **Google OAuth** vía Supabase Auth
- `ProtectedRoute` controla el acceso según estado de sesión
- Dos modos: `authenticated` y `non-authenticated`
- Estado de sesión persistido con `supabase.auth.onAuthStateChange`

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- Una cuenta en [Supabase](https://supabase.com) con proyecto creado

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/softcreate-pos.git
cd softcreate-pos

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Levantar en desarrollo
npm run dev
```

---

## 🔑 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Nunca** subas tu archivo `.env.local` al repositorio. Está incluido en `.gitignore` por defecto.

---

## 🎨 Sistema de Temas

Tema claro y oscuro gestionado con Zustand (`ThemeStore`) y aplicado globalmente mediante `ThemeProvider` de Styled Components. Los tokens de color, tipografía y espaciado están centralizados en `src/styles/`.

```js
// Cambio de tema en cualquier componente
const { theme, toggleTheme } = useThemeStore();
```

---

## 📁 Estructura de Storage

Las imágenes se almacenan en Supabase Storage bajo el bucket `imagenes`:

```
imagenes/
├── empresa/
│   └── {id_empresa}/logo.webp
└── metodospago/
    └── {id_metodo}/icon.webp
```

---

<div align="center">

### ¿Encontraste un bug o tienes una idea?

[![Issues](https://img.shields.io/badge/Abrir%20un%20Issue-red?style=for-the-badge&logo=github)](https://github.com/tu-usuario/softcreate-pos/issues)
[![Pull Requests](https://img.shields.io/badge/Contribuir-blue?style=for-the-badge&logo=github)](https://github.com/tu-usuario/softcreate-pos/pulls)

<br/>

---

Desarrollado con 💜 por el equipo **SoftCreate**

*Hecho en Colombia 🇨🇴 para el mundo*

</div>

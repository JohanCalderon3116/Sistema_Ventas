# 🛒 SoftCreate POS

> Sistema de punto de venta moderno, modular y escalable construido con React + Vite, Supabase y arquitectura atómica.

---

## 📋 Tabla de contenidos

- [Descripción general](#descripción-general)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Módulos del sistema](#módulos-del-sistema)
- [Gestión de estado con Zustand](#gestión-de-estado-con-zustand)
- [Comunicación con Supabase](#comunicación-con-supabase)
- [Rutas protegidas](#rutas-protegidas)
- [Servicio de impresión](#servicio-de-impresión)
- [Instalación y configuración](#instalación-y-configuración)
- [Variables de entorno](#variables-de-entorno)

---

## 📌 Descripción general

**SoftCreate POS** es una solución de punto de venta diseñada para pequeñas y medianas empresas. Permite gestionar ventas, productos, clientes, proveedores, sucursales, cajas e impresoras térmicas desde una interfaz web moderna y responsiva.

El sistema está construido bajo una arquitectura de componentes atómica (Atomic Design), lo que lo hace altamente mantenible, reutilizable y escalable.

---

## ⚙️ Stack tecnológico

| Tecnología | Uso |
|---|---|
| **React + Vite** | Framework principal y bundler |
| **Supabase** | Base de datos, autenticación y storage |
| **Zustand** | Gestión de estado global |
| **TanStack Query** | Fetching, caché y sincronización de datos |
| **Styled Components** | Estilos con soporte de temas dinámicos |
| **React Router DOM** | Enrutamiento con rutas protegidas |
| **Sonner** | Notificaciones toast |
| **ASP.NET Core (NET 8)** | Microservicio de impresión térmica |
| **FreeSpire.PDF** | Impresión directa de PDFs |

---

## 🗂️ Arquitectura del proyecto

El proyecto sigue **Atomic Design** combinado con una estructura por responsabilidad:
src/
├── assets/                  # Imágenes, íconos y recursos estáticos
├── components/
│   ├── atomos/              # Elementos base: Icono, Título, Línea, Lottie
│   ├── moleculas/           # Combinaciones simples: Btn1, Spinner, ImageContent
│   ├── organismos/          # Bloques complejos por módulo:
│   │   ├── DashboardDesign/
│   │   ├── EmpresaConfigDesign/
│   │   ├── POSDesing/
│   │   ├── SucursalesDesign/
│   │   ├── formularios/
│   │   ├── sidebar/
│   │   └── tablas/
│   ├── templates/           # Layouts de página completos
│   └── ui/                  # Componentes de UI reutilizables
│       ├── animated/
│       ├── buttons/
│       ├── lists/
│       └── toogles/
├── context/                 # AuthContext con Supabase Auth
├── hooks/                   # Hooks personalizados
├── pages/                   # Páginas (una por ruta)
├── reports/                 # Generación de tickets y reportes PDF
├── routers/                 # Definición de rutas protegidas
├── store/                   # Stores de Zustand por módulo
├── styles/                  # Temas, variables, keyframes y estilos globales
├── supabase/                # Cliente y consultas por tabla
├── utils/                   # Funciones utilitarias
├── App.jsx
├── index.js                 # Barrel de exportaciones
└── main.jsx
### Capas de la arquitectura

**Átomos** — el elemento más pequeño e indivisible. No dependen de nada más del sistema.

**Moléculas** — combinan átomos para formar elementos funcionales simples.

**Organismos** — agrupan moléculas y átomos en bloques funcionales de negocio, organizados por módulo.

**Templates** — definen el layout de cada página ensamblando organismos.

**Pages** — componentes de una sola línea que solo invocan su template:
```jsx
export const Empresa = () => <EmpresaTemplate />;
```

---

## 📦 Módulos del sistema

| Módulo | Descripción |
|---|---|
| **POS** | Punto de venta: carrito, pagos, descuentos |
| **Dashboard** | Resumen de ventas y métricas |
| **Productos** | CRUD de productos con categorías y marcas |
| **Clientes / Proveedores** | Gestión de terceros |
| **Métodos de pago** | Configuración de formas de pago con ícono |
| **Sucursales y cajas** | Asignación de cajas por sucursal |
| **Impresoras** | Configuración de impresoras térmicas por caja |
| **Empresa** | Configuración básica y de moneda |

---

## 🐻 Gestión de estado con Zustand

Cada módulo tiene su propio store en `src/store/`. Los stores encapsulan las llamadas a Supabase y exponen métodos y estado al resto de la app, combinados con **TanStack Query** para caché e invalidación automática.

```js
export const useEmpresaStore = create((set) => ({
  dataempresa: [],
  mostrarempresa: async (p) => {
    const response = await MostrarEmpresaXidusuario(p);
    set({ dataempresa: response });
    return response;
  },
  editarEmpresa: async (p, fileold, filnew) => {
    await EditarEmpresa(p, fileold, filnew);
  },
}));
```

---

## 🔌 Comunicación con Supabase

El cliente se configura en `src/supabase/supabase.config.js`. Cada tabla tiene su propio archivo de consultas.

El hook `useSupabaseSubscription` escucha cambios en tiempo real e invalida automáticamente la caché de TanStack Query.

Las imágenes se almacenan en Supabase Storage bajo el bucket `imagenes`, con rutas por módulo: `imagenes/metodospago/{id}`, `imagenes/empresa/{id}`.

---

## 🔐 Rutas protegidas

`ProtectedRoute` controla el acceso según el estado de autenticación. Soporta dos modos: `authenticated` y `non-authenticated`. La autenticación usa `supabase.auth.onAuthStateChange` con login por Google vía OAuth.

---

## 🖨️ Servicio de impresión

Microservicio local en **ASP.NET Core (NET 8)** para impresión directa en impresoras térmicas sin cuadro de diálogo. Corre como Windows Service en el equipo del cajero.

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/list` | Lista las impresoras instaladas |
| GET | `/api/pc` | Retorna nombre del PC e IP local |
| POST | `/api/print_ticket` | Recibe un PDF y lo imprime |

---

## 🚀 Instalación y configuración

```bash
git clone https://github.com/tu-usuario/softcreate-pos.git
cd softcreate-pos
npm install
cp .env.example .env.local
npm run dev
```

---

## 🔑 Variables de entorno

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎨 Sistema de temas

Tema claro y oscuro gestionado con Zustand (`ThemeStore`) y aplicado globalmente con `ThemeProvider` de Styled Components. Definido en `src/styles/`.

---

<p align="center">Desarrollado con 💜 por el equipo SoftCreate</p>
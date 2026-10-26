import { v } from "../styles/variables";

export const DesplegableUser = [
  {
    text: "Mi perfil",
    icono: <v.iconoUser/>,
    tipo: "miperfil",
  },
  {
    text: "Configuracion",
    icono: <v.iconoSettings/>,
    tipo: "configuracion",
  },
  {
    text: "Cerrar sesión",
    icono: <v.iconoCerrarSesion/>,
    tipo: "cerrarsesion",
  },
];

export const LinksArray = [
  {
    label: "Inicio",
    icon: "lucide:home",
    to: "/",
  },
  {
    label: "Dashboard",
    icon: "lucide:layout-dashboard",
    to: "/dashboard",
  },
  {
    label: "Vender",
    icon: "lucide:shopping-cart",
    to: "/pos",
  },
  {
    label: "Inventario",
    icon: "lucide:package",
    to: "/inventario",
  },
];
export const SecondarylinksArray = [
  {
    label: "Configuración",
    icon: "lucide:settings",
    to: "/configuracion",
  },
  {
    label: "Mi perfil",
    icon: "lucide:user",
    to: "/miperfil",
  },
];

export const TemasData = [
  {
    icono: "🌞",
    descripcion: "light",
  },
  {
    icono: "🌚",
    descripcion: "dark",
  },
];

export const TipouserData = [
  {
    descripcion: "empleado",
    icono: "🪖",
  },
  {
    descripcion: "administrador",
    icono: "👑",
  },
];

export const TipoDocData = [
  {
    descripcion: "Dni",
    icono: "🪖",
  },
  {
    descripcion: "Libreta electoral",
    icono: "👑",
  },
  {
    descripcion: "Otros",
    icono: "👑",
  },
];

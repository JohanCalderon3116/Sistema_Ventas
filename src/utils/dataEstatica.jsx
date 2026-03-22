import { v } from "../styles/variables";
import {
  AiOutlineHome,
  AiOutlineSetting,
} from "react-icons/ai";

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



//data SIDEBAR
export const LinksArray = [
  {
    label: "Inicio",
    icon: "noto-v1:house",
    to: "/",
  },
  {
    label: "Vender",
    icon: "flat-color-icons:shop",
    to: "/pos",
  },
  {
    label: "Inventario",
    icon: "flat-ui:box",
    to: "/kardex",
  },
  {
    label: "Reportes",
    icon: "flat-ui:graph",
    to: "/reportes",
  },
 
];
export const SecondarylinksArray = [
 
  {
    label: "Configuración",
    icon:"icon-park:setting-two",
    to: "/configuracion",
    color:"#CE82FF"
  },
  
  

];
//temas
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

//tipo usuario
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
//tipodoc
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
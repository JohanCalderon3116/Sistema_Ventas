import { create } from "zustand";
import { Dark, Light } from "../styles/themes";

const temaGuardado =
  typeof window !== "undefined" ? localStorage.getItem("theme") : null;
const initialTheme = temaGuardado === "dark" ? "dark" : "light";
const initialStyle = temaGuardado === "dark" ? Dark : Light;

export const useThemeStore = create((set) => ({
  theme: initialTheme,
  themeStyle: initialStyle,
  setTheme: (p) => {
    set({ theme: p.tema, themeStyle: p.style });
    if (typeof window !== "undefined") {
      if (p.tema) {
        localStorage.setItem("theme", p.tema);
      }
      if (p.style?.bgtotal) {
        document.documentElement.style.backgroundColor = p.style.bgtotal;
      }
    }
  },
}));

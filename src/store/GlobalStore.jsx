import { create } from "zustand";
const initialState = {
  stateClose: false,
  itemSelect: null,
  accion: "",
  isExploding: false,
};
export const useGlobalStore = create((set) => ({
  ...initialState,
  setStateClose: (p) => set({ stateClose: p }),
  setItemSelect: (p) => set({ itemSelect: p }),
  setAccion: (p) => set({ accion: p }),
  setIsExplonding: (p) => set({ isExploding: p }),
  file: [],
  setFile: (p) => {
    set({ file: p });
  },
  fileurl: "",
  setFileurl: (p) => {
    set({ fileurl: p });
  },
}));

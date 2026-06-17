import { create } from "zustand";

export const useGlobalStore = create((set) => ({
  file: [],
  setFile: (p) => {
    set({ file: p });
  },
  fileurl: "",
  setFileurl: (p) => {
    set({ fileurl: p });
  },
}));

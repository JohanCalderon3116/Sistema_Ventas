import { create } from "zustand";
const fetchWithTimeOut = (url, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), timeout);
    fetch(url)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};
export const useImpresorasStore = create((set, get) => ({
  mostrarDatosPc: async () => {
    try {
      const response = await fetchWithTimeOut(
        "http://localhost:5075/Printer/get-local-ip",
        5000,
      );
      if (!response.ok) {
        throw new Error(`Error de red: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  },
}));

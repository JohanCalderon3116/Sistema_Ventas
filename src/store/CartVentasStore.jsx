import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  items: [],
  total: 0,
};

function calcularTotal(items) {
  return items.reduce(
    (total, item) => total + item._precio_venta * item._cantidad,
    0,
  );
}

export const useCartVentasStore = create(
  persist(
    (set) => ({
      ...initialState,
      addItem: (p) =>
        set((state) => {
          //verificar si el producto ya esta ene l carrito
          const existingItem = state.items.find(
            (item) => item._id_producto === p._id_producto,
          );
          if (existingItem) {
            //Si el producto ya esta en el carrito, aumentar la cantidad
            const updatedItems = state.items.map((item) => {
              if (item._id_producto === p._id_producto) {
                return {
                  ...item,
                  _cantidad: item._cantidad + 1,
                  _total: item._total + p._cantidad * p._precio_venta,
                };
              }
              return item;
            });
            return { items: updatedItems, total: calcularTotal(updatedItems) };
          } else {
            //si el producto no esta en el carrito lo agrega
            return {
              items: [...state.items, p],
              total: calcularTotal([...state.items, p]),
            };
          }
        }),
      removeItem: (p) =>
        set((state) => ({
          items: state.items.filter((item) => item !== p),
        })),
      resetState: () => set(initialState),
      addCantidadItem: (p) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item._id_producto === p._id_producto && item._cantidad > 0) {
              const updatedItem = {
                ...item,
                _cantidad: item._cantidad + 1,
              };
              updatedItem._total =
                updatedItem._cantidad * updatedItem._precio_venta;
              return updatedItem;
            }
            return item;
          });
          return { items: updatedItems, total: calcularTotal(updatedItems) };
        }),
      restarCantidadItem: (p) =>
        set((state) => {
          const updatedItems = state.items
            .map((item) => {
              if (item._id_producto === p._id_producto && item._cantidad > 0) {
                const updatedQuantity = item._cantidad - 1;
                if (updatedQuantity === 0) {
                  return null;
                } else {
                  const updatedItem = {
                    ...item,
                    _cantidad: updatedQuantity,
                  };
                  updatedItem._total =
                    updatedItem._cantidad * updatedItem._precio_venta;
                  return updatedItem;
                }
              }
              return item;
            })
            .filter(Boolean); //filtrar elementso nulos
          return { items: updatedItems, total: calcularTotal(updatedItems) };
        }),
    }),
    {
      name: "cart-ventas-storage",
    },
  ),
);

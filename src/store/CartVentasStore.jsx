import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useClientesProveedoresStore } from "./ClientesProveedoresStore";

const initialState = {
  items: [],
  total: 0,
  statePantallaCobro: false,
  tipocobro: "",
  stateMetodosPago: false,
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
                const newQuantity = item._cantidad + (p._cantidad || 1);
                return {
                  ...item,
                  _cantidad: newQuantity,
                  _total: newQuantity * item._precio_venta,
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
        set((state) => {
          const updatedItems = state.items.filter((item) => item !== p);
          return {
            items: updatedItems,
            total: calcularTotal(updatedItems)
          }
        }),
      resetState: () => {
        const { selectCliPro } = useClientesProveedoresStore.getState();
        selectCliPro([]);
        set(initialState);
      },
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
      updateCantidadItem: (p, cantidad) =>
        set((state) => {
          const updateItems = state.items.map((item) => {
            if (item._id_producto === p._id_producto) {
              const updateItem = {
                ...item,
                _cantidad: cantidad,
                _total: cantidad * item._precio_venta,
              };
              return updateItem;
            }
            return item;
          });
          return {
            items: updateItems,
            total: calcularTotal(updateItems),
          };
        }),
      setStatePantallaCobro: (p) =>
        set((state) => {
          if (state.items.length === 0) {
            toast.warning(
              "Creo que deberías agregar un producto. Bueno... Solo digo 😆",
            );
            return {
              state,
            };
          } else {
            return {
              statePantallaCobro: !state.statePantallaCobro,
              tipocobro: p.tipocobro,
            };
          }
        }),
      setStateMetodosPago: () =>
        set((state) => ({ stateMetodosPago: !state.stateMetodosPago })),
    }),
    {
      name: "cart-ventas-storage",
    },
  ),
);

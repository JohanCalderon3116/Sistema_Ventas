import { Route, Routes } from "react-router-dom";
import {
  Categorias,
  Configuraciones,
  Home,
  Login,
  ProtectedRoute,
  Spinner1,
  useEmpresaStore,
  userAuth,
  useUsuariosStore,
} from "../index";
import { useQuery } from "@tanstack/react-query";

export function Myroutes() {
  const { datausuarios, mostrarusuarios } = useUsuariosStore();
  const { user } = userAuth();
  const { mostrarempresa, dataempresa } = useEmpresaStore();
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar usuarios"],
    queryFn: mostrarusuarios,
  });
  const {data: dtaempresa} = useQuery({
    queryKey: ["mostrar empresa", datausuarios?.id],
    queryFn: () => mostrarempresa({ _id_usuario: datausuarios?.id }),
    enabled: !!datausuarios,
  });
  if (isLoading) {
    return <Spinner1></Spinner1>;
  }
  if (error) {
    return <span>error...</span>;
  }
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute user={user} redirectTo={"/login"}></ProtectedRoute>
        }
      >
        <Route path="/" element={<Home></Home>}></Route>
        <Route
          path="/configuracion"
          element={<Configuraciones></Configuraciones>}
        ></Route>
        <Route
          path="/configuracion/categorias"
          element={<Categorias></Categorias>}
        ></Route>
      </Route>
      <Route path="/login" element={<Login></Login>}></Route>
    </Routes>
  );
}

import { Route, Routes } from "react-router-dom";
import {
  Categorias,
  Configuraciones,
  Home,
  Login,
  Marca,
  Productos,
  ProtectedRoute,
  POS,
  Layout,
  PageNot,
} from "../index";

export function Myroutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedRoute accesby="non-authenticated">
            <Login></Login>
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <Home></Home>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracion"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <Configuraciones></Configuraciones>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracion/categorias"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <Categorias></Categorias>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracion/marca"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <Marca></Marca>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracion/productos"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <Productos></Productos>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <POS></POS>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<PageNot></PageNot>}></Route>
    </Routes>
  );
}

import { Navigate, Route, Routes } from "react-router-dom";
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
  Empresa,
  BasicosConfig,
  MonedaConfig,
  ClientesProveedores,
  MetodosPago,
  Dashboard,
  SucursalesCaja,
  Impresoras
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
        path="/configuracion/empresa"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <Empresa></Empresa>
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Navigate to="empresabasicos"></Navigate>}
        ></Route>
        <Route
          path="empresabasicos"
          element={<BasicosConfig></BasicosConfig>}
        ></Route>
        <Route
          path="monedaconfig"
          element={<MonedaConfig></MonedaConfig>}
        ></Route>
      </Route>
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
      <Route
        path="/configuracion/clientes"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <ClientesProveedores></ClientesProveedores>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracion/proveedores"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <ClientesProveedores></ClientesProveedores>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracion/metodospago"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <MetodosPago></MetodosPago>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracion/sucursales-cajas"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <SucursalesCaja></SucursalesCaja>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracion/impresoras"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <Impresoras></Impresoras>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute accesby="authenticated">
            <Layout>
              <Dashboard></Dashboard>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

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
  Impresoras,
  Almacenes,
} from "../index";
import { Usuarios } from "../pages/Usuarios";
import { Inventario } from "../pages/Inventario";
import { ConfiguracionTicket } from "../pages/ConfiguracionTicket";

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
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <Configuraciones></Configuraciones>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/inventario"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <Inventario></Inventario>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/categorias"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <Categorias></Categorias>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/marca"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <Marca></Marca>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/productos"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <Productos></Productos>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/empresa"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <Empresa></Empresa>
            </ProtectedRoute>
          </Layout>
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
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <POS></POS>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/clientes"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <ClientesProveedores></ClientesProveedores>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/proveedores"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <ClientesProveedores></ClientesProveedores>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/metodospago"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <MetodosPago></MetodosPago>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/ticket"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <ConfiguracionTicket></ConfiguracionTicket>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/sucursales-cajas"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <SucursalesCaja></SucursalesCaja>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/impresoras"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <Impresoras></Impresoras>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/usuarios"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <Usuarios></Usuarios>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/almacenes"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <Almacenes></Almacenes>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <Home></Home>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <ProtectedRoute accesby="authenticated">
              <Dashboard></Dashboard>
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route path="*" element={<PageNot></PageNot>}></Route>
    </Routes>
  );
}

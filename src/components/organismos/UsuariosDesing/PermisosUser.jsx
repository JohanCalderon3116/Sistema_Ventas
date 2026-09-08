import styled from "styled-components";
import { SelectList } from "../../ui/lists/SelectList";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check } from "../../ui/toogles/Check";
import { useRolesStore } from "../../../store/RolesStore";
import { usePermisosStore } from "../../../store/PermisosStore";
import { useEffect } from "react";
import { useAsignacionCajaSucursalesStore } from "../../../store/AsignacionCajaSucursales";
import { BarLoader } from "react-spinners";
import { useMostrarModulosQueryStack } from "../../../tanstack/ModulosStack";
import { useMostrarRolesQueryStack } from "../../../tanstack/RolesStack";
import {
  useMostrarPermisosDefaultQueryStack,
  useMostrarPermisosPorUsuariosQueryStack,
} from "../../../tanstack/PermisosStack";

export const PermisosUser = () => {
  const { rolesItemSelect, setRolesItemSelect } = useRolesStore();
  const {
    toggleModule,
    selectModules,
    setSelectModules,
    actualizarPermisos,
  } = usePermisosStore();
  const { accion, selectItem: selectItemAsignaciones } =
    useAsignacionCajaSucursalesStore();
  const { data: dataModulos, isLoading: isLadingModulos } =
    useMostrarModulosQueryStack();
  const { data: dataRoles, isLoading: isLadingRoles } =
    useMostrarRolesQueryStack();
  const { data: dataPermisosDefault, isLoading: isLadingPermisosDefault } =
    useMostrarPermisosDefaultQueryStack();
  const { data: dataPermisos, isLoading: isLadingPermisosUser } =
    useMostrarPermisosPorUsuariosQueryStack(selectItemAsignaciones);
  const mutation = useMutation({
    mutationKey: ["actualizar permisos"],
    mutationFn: () => actualizarPermisos(),
  });
  useEffect(() => {
    if (accion === "Nuevo") {
      const permisosPorRol =
        dataPermisosDefault
          ?.filter((permiso) => permiso.id_rol === rolesItemSelect?.id)
          .map((permiso) => permiso.id_modulo) || [];
      setSelectModules(permisosPorRol);
    }
  }, [rolesItemSelect, setRolesItemSelect, dataPermisosDefault]);
  useEffect(() => {
    if (accion === "Editar" && dataPermisos) {
      const permisosUsuario = dataPermisos.map((permiso) => permiso.id_modulo);
      setSelectModules(permisosUsuario);
    }
  }, [accion, dataPermisos]);
  const isLoading =
    isLadingModulos ||
    isLadingRoles ||
    isLadingPermisosDefault ||
    isLadingPermisosUser;
  if (isLoading) {
    return <BarLoader color="#6c6c6c"></BarLoader>;
  }
  return (
    <Container>
      <Title>Permisos</Title>
      <label>Tipo: </label>
      <SelectList
        data={dataRoles}
        displayField="nombre"
        onSelect={setRolesItemSelect}
        itemSelect={rolesItemSelect}
      ></SelectList>
      <List>
        {dataModulos?.map((module) => (
          <ListItem key={module?.id}>
            <Check
              onChange={() => toggleModule(module?.id)}
              checked={selectModules.includes(module?.id)}
            ></Check>
            <Label> {module?.nombre} </Label>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.5rem;
  border-left: 1px dashed ${({ theme }) => theme.text};
`;
const Title = styled.span`
  font-size: 1.5rem;
  text-align: center;
`;
const List = styled.ul`
  list-style: none;
  padding: 0;
`;
const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
`;
const Label = styled.span`
  font-size: 1rem;
  color: #555;
  margin-left: 15px;
`;

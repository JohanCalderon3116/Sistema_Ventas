import styled from "styled-components";
import { SelectList } from "../../ui/lists/SelectList";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useModulosStore } from "../../../store/ModulosStore";
import { Check } from "../../ui/toogles/Check";
import { useRolesStore } from "../../../store/RolesStore";
import { usePermisosStore } from "../../../store/PermisosStore";
import { useEffect } from "react";
import { useAsignacionCajaSucursalesStore } from "../../../store/AsignacionCajaSucursales";
import { BarLoader } from "react-spinners";

export const PermisosUser = () => {
  const { mostrarmodulos } = useModulosStore();
  const { mostrarRoles, rolesItemSelect, setRolesItemSelect } = useRolesStore();
  const {
    mostrarPermisos,
    toggleModule,
    selectModules,
    setSelectModules,
    mostrarPermisosDefault,
    actualizarPermisos,
  } = usePermisosStore();
  const {
    accion,
    setAccion,
    selectItem: selectItemAsignaciones,
  } = useAsignacionCajaSucursalesStore();
  const { data: dataModulos, isLoading: isLadingModulos } = useQuery({
    queryKey: ["mostrar modulos"],
    queryFn: mostrarmodulos,
  });
  const { data: dataRoles, isLoading: isLadingRoles } = useQuery({
    queryKey: ["mostrar roles"],
    queryFn: mostrarRoles,
  });
  const { data: dataPermisosDefault, isLoading: isLadingPermisosDefault } =
    useQuery({
      queryKey: ["mostrar permisos default"],
      queryFn: mostrarPermisosDefault,
    });

  const { data: dataPermisos, isLoading: isLadingPermisosUser } = useQuery({
    queryKey: ["mostrar permisos por usuarios"],
    queryFn: () =>
      mostrarPermisos({ id_usuario: selectItemAsignaciones?.id_usuario }),
    enabled: !!selectItemAsignaciones,
  });

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

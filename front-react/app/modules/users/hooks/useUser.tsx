import { validarForm } from "@shared/helpers";
import { ToastAlert } from "@shared/utils";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { registerService, updateService, usersService, deleteService } from "../services";
import { useUserStore } from "../store";

export function useUser() {
  const navigate = useNavigate();

  const hasFetched = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "" as string,
    email: "" as string,
    password: "" as string,
    role_id: "" as string,
  });

  //Estados globales
  const users = useUserStore((state) => state.users);
  const setUsers = useUserStore((state) => state.setUsers);
  const pagination = useUserStore((state) => state.pagination);
  const setPagination = useUserStore((state) => state.setPagination);

  //Obtenemos los usuarios
  const getUsers = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    const response = await usersService(page);
    
    if (response.status && response.data) {
      const { data, ...paginationInfo } = response.data;
      setUsers(data || []);
      setPagination(paginationInfo);
      setIsLoading(false);
    } else {
      ToastAlert("Error", response.message, "error", 2000);
      setIsLoading(false);
      return [];
    }
  }, [setUsers, setPagination]);

  const getUser = useCallback(
    async (id: number) => {
      return users.find((u) => u.id === id) || null;
    },
    [users],
  );

  //Registro de usuarios
  const handleRegister = useCallback(async () => {
    if (!validarForm(form)) return;
    setIsLoading(true);
    const response = await registerService({
      name: form.name,
      email: form.email,
      password: form.password,
      role_id: Number(form.role_id),
    });

    if (response.status) {
      await getUsers(); // Recargar lista
      navigate("/users");
      ToastAlert("Éxito", response.message, "success", 2000);
    } else {
      ToastAlert("Error", response.message, "error", 2000);
    }
    setIsLoading(false);
  }, [form, navigate, getUsers]);

  //Actualizacion de usuarios
  const handleUpdate = useCallback(
    async (id: number) => {
      setIsLoading(true);
      const response = await updateService({
        id,
        name: form.name,
        role_id: Number(form.role_id),
      });
      if (response.status) {
        await getUsers(); // Recargar lista
        navigate("/users");
        ToastAlert("Éxito", response.message, "success", 2000);
      } else {
        ToastAlert("Error", response.message, "error", 2000);
      }
      setIsLoading(false);
    },
    [form, navigate, getUsers],
  );

  //Eliminar usuario
  const handleDelete = useCallback(
    async (id: number) => {
      setIsLoading(true);
      const response = await deleteService(id);
      if (response.status) {
        await getUsers(); // Recargar lista
        ToastAlert("Éxito", response.message, "success", 2000);
      } else {
        ToastAlert("Error", response.message, "error", 2000);
      }
      setIsLoading(false);
    },
    [getUsers],
  );

  //Regresar
  const backRoute = useCallback(() => {
    navigate("/users");
  }, [navigate]);

  //Memorizacion y retorno
  return useMemo(
    () => ({
      hasFetched,
      isLoading,
      users,
      pagination,
      form,
      setIsLoading,
      setForm,
      getUsers,
      getUser,
      handleRegister,
      handleUpdate,
      handleDelete,
      backRoute,
    }),
    [
      hasFetched,
      isLoading,
      users,
      pagination,
      form,
      setIsLoading,
      setForm,
      getUsers,
      getUser,
      handleRegister,
      handleUpdate,
      handleDelete,
      backRoute,
    ],
  );
}
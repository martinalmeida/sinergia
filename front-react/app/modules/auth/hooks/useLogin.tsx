import { validarForm } from "@shared/helpers";
import { ToastAlert } from "@shared/utils";
import { useState } from "react";
import { useNavigate } from "react-router";
import { loginService, logoutService } from "../services";

export function useLogin() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    usuUsua: "",
    usuPass: "",
  });

  //Método para iniciar sesión
  const handleLogin = async () => {
    if (!validarForm({ Usuario: form.usuUsua, Contraseña: form.usuPass }))
      return;
    setIsLoading(true);
    const response = await loginService({
      usuUsua: form.usuUsua,
      usuPass: form.usuPass,
    });
    if (response.status) {
      ToastAlert("Bienvenido", response.message, "success", 3000);
      navigate("/home");
    } else {
      ToastAlert("Error al iniciar sesión", response.message, "error", 3000);
    }
    setIsLoading(false);
  };

  //Método para cerrar sesión
  const handleLogout = async () => {
    setIsLoading(true);
    const response = await logoutService();
    if (!response.status) {
      ToastAlert("Error", response.message, "error", 3000);
    }
    window.location.href = '/';
  };

  return {
    //Estados
    form,
    isLoading,
    //Métodos
    setForm,
    handleLogin,
    handleLogout,
  };
}
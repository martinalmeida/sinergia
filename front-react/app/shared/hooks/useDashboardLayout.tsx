import { useLogin } from "@modules/auth/hooks";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useSessionStore } from "../store";
import { allowedModules } from "../utils";

export const useDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, handleLogout } = useLogin();
  const usuPerf = useSessionStore((state) => state.usuPerf);


  //Computar módulos permitidos
  const modules = usuPerf ? allowedModules[usuPerf] : [];

  //Verificar si una ruta está activa
  const isActive = (path: string) => location.pathname.startsWith(path);

  //Confirmar logout
  const confirmLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro que deseas salir de tu cuenta?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      handleLogout();
    }
  };

  return {
    //Estado
    isLoading,
    modules,
    //Funciones
    isActive,
    confirmLogout,
    navigate,
  };
};
import BtnBaseComponent from "@shared/components/BtnBaseComponent";
import InputBase from "@shared/components/InputBaseComponent";
import LoaderComponent from "@shared/components/LoaderComponent";
import { useDarkMode } from "@shared/hooks/useDarkMode";
import { useSessionStore } from "@shared/store";
import { LogIn, Moon, Sun } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../hooks";

export function Login() {
  const { isLoading, form, setForm, handleLogin } = useLogin();
  const { darkMode, toggleDarkMode, isMounted } = useDarkMode();
  const navigate = useNavigate();

  const hasFetched = useRef(false);
  const jwt = useSessionStore((state) => state.jwt);

  useEffect(() => {
    if (!hasFetched.current && typeof jwt === "string") {
      hasFetched.current = true;
      if (jwt && jwt !== null && hasFetched.current) {
        navigate("/home");
      }
    }
  }, [jwt, hasFetched, navigate]);

  if (isLoading) return <LoaderComponent />;
  return (
    <div className="w-full min-h-screen flex justify-center items-center relative overflow-hidden bg-[#f2f2f2] dark:bg-[#0b1220]">
      <main
        role="main"
        className="w-full max-w-sm sm:max-w-md md:max-w-lg p-4 sm:p-6 md:p-8 rounded-xl bg-white/75 dark:bg-slate-800/85 backdrop-blur-md shadow-lg dark:shadow-gray-900/50 relative z-10"
      >
        {isMounted && (
          <button
            type="button"
            onClick={toggleDarkMode}
            className="absolute top-3 right-3 bg-gray-100 dark:bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600"
            aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
            title={darkMode ? "Modo claro" : "Modo oscuro"}
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-yellow-400" />
            ) : (
              <Moon className="h-4 w-4 text-gray-600" />
            )}
          </button>
        )}

        <div className="w-full flex justify-center mb-3">
          <div className="bg-white dark:bg-gray-700 p-1 rounded-lg shadow-sm dark:shadow-gray-900/40">
            <img
              src="/logo.png"
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14"
              alt="logo"
            />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-lg sm:text-2xl font-semibold text-[#273459] dark:text-blue-400 leading-tight">
            Bienvenido
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
            Ingresa tus credenciales
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="mt-4"
        >
          <div className="space-y-2">
            <div className="relative">
              <InputBase
                placeholder="Usuario"
                value={form.usuUsua}
                onChangeText={(text) => setForm({ ...form, usuUsua: text })}
                type="email"
              />
            </div>
            <div className="relative">
              <InputBase
                placeholder="Contraseña"
                value={form.usuPass}
                onChangeText={(text) => setForm({ ...form, usuPass: text })}
                type="password"
              />
            </div>
          </div>

          <div className="mt-4">
            <BtnBaseComponent
              label="Ingresar"
              variant="primary"
              icon={<LogIn size={16} />}
              type="submit"
            />
          </div>
        </form>
      </main>
      <footer
        aria-hidden="true"
        className="fixed bottom-2 right-3 text-gray-500 dark:text-gray-400 text-xs select-none z-10"
      >
        Todos los derechos reservados © Lineas Hospitalarias 2025
      </footer>
    </div>
  );
}
import animation404 from "@/assets/404.json";
import Lottie from "lottie-react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { ClientOnly } from "../components/ClientOnly";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F2F2] dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-lg sm:max-w-3xl mx-auto">
        <main
          role="main"
          aria-labelledby="notfound-title"
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
        >
          {/* Lottie responsive container */}
          <div className="flex-shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52">
              <ClientOnly>
                <Lottie
                  animationData={animation404}
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                  aria-hidden={false}
                  role="img"
                  title="Animación 404"
                />
              </ClientOnly>
            </div>
          </div>

          {/* Texto y acciones */}
          <div className="flex-1 text-center sm:text-left">
            <h1
              id="notfound-title"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-2"
            >
              404
            </h1>

            <p className="text-lg sm:text-xl text-[#70778C] dark:text-gray-300 mb-1">
              Pantalla no encontrada
            </p>

            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
              Lo sentimos — la página que buscas no existe o fue movida.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto flex items-center gap-2 justify-center px-4 py-3 rounded-lg bg-[#273459] dark:bg-blue-600 text-white font-semibold hover:opacity-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#273459]/30 dark:focus-visible:ring-blue-500/30"
                aria-label="Volver"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="whitespace-nowrap">Volver</span>
              </button>

              <Link
                to="/home"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Ir al inicio
              </Link>
            </div>
          </div>
        </main>

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
          Si crees que esto es un error del sistema, contacta con el equipo de
          soporte.
        </div>
      </div>
    </div>
  );
}
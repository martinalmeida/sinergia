import { LogOut, Moon, Sun } from "lucide-react";
import { Link, Outlet } from "react-router";
import LoaderComponent from "../components/LoaderComponent";
import ProfileLetterComponent from "../components/ProfileLetterComponent";
import { useDarkMode } from "../hooks/useDarkMode";
import { useDashboardLayout } from "../hooks/useDashboardLayout";
import type { ModuleConfig } from "../utils";

export default function DashboardLayout() {
  const {
    isLoading,
    modules,
    isActive,
    confirmLogout,
  } = useDashboardLayout();

  const { darkMode, toggleDarkMode, isMounted } = useDarkMode();

  if (isLoading) return <LoaderComponent />;
  return (
    <div className="h-screen w-screen flex bg-[#f2f2f2] dark:bg-gray-900 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden relative lg:flex left-2 top-1/2 transform -translate-y-1/2 z-50 flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow p-1 h-fit">
        {/* Menu Items */}
        <ul className="flex flex-col items-center gap-2">
          {modules?.map((module: ModuleConfig) => (
            <li key={module.name} className="w-fit">
              <Link
                title={module.title}
                to={module.path}
                aria-label={module.title}
                className={`w-fit h-16 px-3 flex items-center justify-center transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 hover:rounded-2xl ${
                  isActive(module.path)
                    ? "text-[#273459] dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {module.icon}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout (centrado con el resto) */}
        <div
          onClick={confirmLogout}
          className="mt-2 w-fit h-12 flex items-center justify-center px-3 transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-red-200 dark:hover:bg-red-900 hover:rounded-2xl text-red-700 dark:text-red-400 cursor-pointer"
          aria-label="Logout"
          role="button"
          tabIndex={0}
        >
          <LogOut className="w-5 h-5" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col mt-2 mx-2">
        {/* Top Navigation */}
        <nav className="fixed lg:left-18 left-4 right-4 px-4 flex justify-between bg-white/90 dark:bg-gray-800/90 h-12 rounded-2xl shadow border border-gray-200/80 dark:border-gray-700/60 backdrop-blur-sm z-50">
          <div className="flex items-center">
            <Link to="/home" className="h-10 w-10">
              <img
                className="h-full w-full mx-auto"
                src="/logo.png"
                alt="logo"
              />
            </Link>
          </div>
          {/* Right side: Dark Mode + Bell + Profile */}
          <ul className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            {isMounted && (
              <li>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="bg-gray-100 dark:bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600"
                  aria-label={
                    darkMode ? "Activar modo claro" : "Activar modo oscuro"
                  }
                  title={darkMode ? "Modo claro" : "Modo oscuro"}
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              </li>
            )}
            {/* Profile */}
            <li className="h-8 w-8">
              <ProfileLetterComponent width={32} height={32} />
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pt-14 px-3 pb-16 lg:pb-0 bg-[#f2f2f2] dark:bg-gray-900">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav
        className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 lg:hidden w-[min(96%,theme('width.96'))] max-w-lg h-14 border border-gray-200/80 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex justify-center items-center gap-1 overflow-hidden rounded-2xl shadow-lg"
        aria-label="bottom-navigation"
      >
        {modules?.map((module: ModuleConfig) => (
          <Link
            key={module.name}
            to={module.path}
            aria-label={module.title}
            className={`w-fit flex flex-col items-center justify-center h-full px-4 transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 hover:rounded-2xl ${
              isActive(module.path)
                ? "text-[#273459] dark:text-blue-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              {module.icon}
            </div>
            <span className="text-[10px] leading-none mt-0.5 truncate">
              {module.title}
            </span>
          </Link>
        ))}

        <div
          onClick={confirmLogout}
          className="w-fit flex flex-col items-center justify-center h-full px-2 transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-red-200 dark:hover:bg-red-900 hover:rounded-2xl text-red-700 dark:text-red-400 cursor-pointer"
        >
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <LogOut className="w-6 h-6" />
          </div>
          <span className="text-[10px] leading-none mt-0.5">Logout</span>
        </div>
      </nav>
    </div>
  );
}
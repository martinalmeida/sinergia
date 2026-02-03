import { Search, User, MapPin, Loader2, X } from "lucide-react";
import { useSearch } from "../hooks/useSearch";

export function SearchView() {
  const { query, results, isLoading, hasSearched, handleSearch, showPatientDetail } = useSearch();

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0f172a] transition-colors duration-300">
      
      {/* Container Principal Centrado */}
      <div className="w-full max-w-3xl px-4 pt-16 md:pt-24 space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#273459] dark:text-white">
            Buscador de <span className="text-blue-600 dark:text-blue-400">Pacientes</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Encuentra información clínica rápidamente
          </p>
        </div>

        {/* Barra de Búsqueda Flotante */}
        <div className="relative group z-10">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="animate-spin text-blue-500" size={24} />
            ) : (
              <Search className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={24} />
            )}
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por nombre, documento o correo..."
            autoFocus
            className="block w-full pl-14 pr-12 py-5 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:shadow-[0_8px_30px_rgb(0,0,0,0.12)] placeholder-gray-400 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500 transition-all duration-300 text-lg text-gray-700 dark:text-gray-100"
          />

          {/* Botón limpiar */}
          {query && (
            <button
              onClick={() => handleSearch("")}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-300 hover:text-gray-500 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Lista de Resultados */}
        <div className="space-y-3 pb-10">
          {results.map((patient, index) => (
            <div
              key={patient.id}
              onClick={() => showPatientDetail(patient)}
              className="group flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900 cursor-pointer transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Avatar / Icono */}
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <User size={20} />
              </div>

              {/* Info Principal */}
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {patient.first_name} {patient.first_surname}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-mono">
                    {patient.document_number}
                  </span>
                  <span>{patient.email}</span>
                </p>
              </div>

              {/* Info Secundaria (oculta en móviles muy pequeños) */}
              <div className="hidden sm:flex flex-col items-end text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{patient.municipality.name}</span>
                </div>
                <span className="text-xs opacity-70">{patient.department.name}</span>
              </div>
            </div>
          ))}

          {/* Estado: Sin Resultados */}
          {hasSearched && !isLoading && results.length === 0 && query.length >= 3 && (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 mb-4">
                <Search size={32} className="text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No hay coincidencias</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-1">
                No encontramos pacientes con el criterio "{query}". Intenta verificar el documento o el nombre.
              </p>
            </div>
          )}

          {/* Estado: Inicial (Tips) */}
          {!hasSearched && !query && (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-gray-400">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p>🔍 Busca por <strong>Cédula</strong></p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p>📧 Busca por <strong>Correo</strong></p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p>👤 Busca por <strong>Nombre</strong></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
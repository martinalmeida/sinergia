import { useState, useCallback, useRef } from "react";
import Swal from "sweetalert2";
import { Patient } from "../../patients/interfaces";
import { searchPatientsService } from "../services";
import { ToastAlert } from "@shared/utils";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); //Para saber si ya buscó al menos una vez

  //Ref para cancelar peticiones anteriores
  const abortControllerRef = useRef<AbortController | null>(null);
  //Ref para el debounce
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    setHasSearched(false);

    //1. Limpiar timeout anterior (Debounce)
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    //Si el texto es muy corto, limpiamos y no buscamos
    if (text.trim().length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    //2. Configurar nuevo timeout
    debounceTimeoutRef.current = setTimeout(async () => {
      //3. Cancelar petición HTTP anterior si existía
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      //Crear nuevo controller
      abortControllerRef.current = new AbortController();

      try {
        const response = await searchPatientsService(text, abortControllerRef.current.signal);
        
        if (response.status && Array.isArray(response.data)) {
          setResults(response.data);
        } else {
          setResults([]);
        }
        setHasSearched(true);
      } catch (error: unknown) {
        //Ignorar errores de cancelación
        if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'CanceledError') {
            return;
        }
        console.error(error);
        ToastAlert("Error", "Error al realizar la búsqueda", "error");
      } finally {
        setIsLoading(false);
      }
    }, 400); //Esperamos 400ms de inactividad antes de buscar
  }, []);

  const showPatientDetail = (patient: Patient) => {
    const fullName = `${patient.first_name} ${patient.second_name || ""} ${patient.first_surname} ${patient.second_surname || ""}`.trim();

    Swal.fire({
      title: `<h3 class="text-2xl font-bold text-[#273459] mb-2">${fullName}</h3>`,
      html: `
        <div class="flex flex-col gap-3 text-left bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="font-semibold text-gray-600">Documento:</span>
            <span class="text-[#273459] font-medium">${patient.document_type.code} ${patient.document_number}</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="font-semibold text-gray-600">Email:</span>
            <span class="text-[#273459] font-medium">${patient.email}</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
             <span class="font-semibold text-gray-600">Género:</span>
             <span class="text-[#273459] font-medium">${patient.gender.name}</span>
          </div>
          <div class="flex justify-between">
             <span class="font-semibold text-gray-600">Ubicación:</span>
             <span class="text-[#273459] font-medium text-right">${patient.municipality.name}, ${patient.department.name}</span>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#273459",
      width: '32rem',
      padding: '2rem',
      customClass: {
        popup: 'rounded-2xl shadow-2xl'
      }
    });
  };

  return {
    query,
    results,
    isLoading,
    hasSearched,
    handleSearch,
    showPatientDetail
  };
}
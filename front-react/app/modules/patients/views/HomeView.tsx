import { DataTable } from "@shared/components/DataTable";
import LoaderComponent from "@shared/components/LoaderComponent";
import { Edit, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { usePatient } from "../hooks";
import { Patient } from "../interfaces";

export function HomeView() {
  const navigate = useNavigate();
  const { hasFetched, isLoading, patients, getPatients, handleDelete } = usePatient();

  const handleEdit = (patient: Patient) => {
    navigate("/patients/edit", { state: { patient } });
  };

  const handleDeleteConfirm = (patient: Patient) => {
    const fullName = `${patient.first_name} ${patient.second_name || ""} ${patient.first_surname} ${patient.second_surname || ""}`.trim();
    
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar al paciente ${fullName}? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(patient.id);
      }
    });
  };

  useEffect(() => {
    if (!hasFetched.current && typeof getPatients === "function") {
      hasFetched.current = true;
      getPatients();
    }
  }, [getPatients]);

  if (isLoading) return <LoaderComponent />;
  return (
    <div className="space-y-4 pb-8">
      <div className="flex justify-between items-center px-1">
        <h1 className="text-xl font-semibold text-[#273459] dark:text-gray-300">
          Pacientes
        </h1>
        <button
          type="button"
          onClick={() => typeof getPatients === "function" && getPatients()}
          disabled={isLoading}
          title="Refrescar"
          aria-label="Refrescar"
          className={`p-2 rounded-md transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <RefreshCw size={18} className="text-gray-600 dark:text-gray-200" />
        </button>
      </div>

      <DataTable
        data={patients as Patient[]}
        columns={[
          { accessorKey: "id", header: "ID" },
          { accessorKey: "document_type.code", header: "Tipo Doc" },
          { accessorKey: "document_number", header: "Documento" },
          { 
            accessorKey: "first_name", 
            header: "Nombre Completo",
            cell: ({ row }) => {
              const patient = row.original as Patient;
              return `${patient.first_name} ${patient.second_name || ""} ${patient.first_surname} ${patient.second_surname || ""}`.trim();
            }
          },
          { accessorKey: "gender.name", header: "Género" },
          { accessorKey: "email", header: "Correo" },
          { accessorKey: "municipality.name", header: "Municipio" },
        ]}
        actions={[
          {
            label: "Editar",
            icon: <Edit size={16} />,
            onClick: handleEdit,
          },
          {
            label: "Eliminar",
            icon: <Trash2 size={16} />,
            onClick: handleDeleteConfirm,
          },
        ]}
        actionsHeader="Acciones"
        enableExport={true}
        exportFileName="pacientes"
        headerAction={{
          label: "Nuevo Paciente",
          icon: <Plus size={18} />,
          onClick: () => navigate("/patients/create"),
        }}
      />
    </div>
  );
}
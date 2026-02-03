import { DataTable } from "@shared/components/DataTable";
import LoaderComponent from "@shared/components/LoaderComponent";
import { Edit, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useUser } from "../hooks";
import { User } from "../interfaces";

export function HomeView() {
  const navigate = useNavigate();
  const { hasFetched, isLoading, users, getUsers, handleDelete } = useUser();

  const handleEdit = (user: User) => {
    navigate("/users/edit", { state: { user } });
  };

  const handleDeleteConfirm = (user: User) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar al usuario ${user.name}? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(user.id);
      }
    });
  };

  useEffect(() => {
    if (!hasFetched.current && typeof getUsers === "function") {
      hasFetched.current = true;
      getUsers();
    }
  }, [getUsers]);

  if (isLoading) return <LoaderComponent />;
  return (
    <div className="space-y-4 pb-8">
      <div className="flex justify-between items-center px-1">
        <h1 className="text-xl font-semibold text-[#273459] dark:text-gray-300">
          Usuarios
        </h1>
        <button
          type="button"
          onClick={() => typeof getUsers === "function" && getUsers()}
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
        data={users as User[]}
        columns={[
          { accessorKey: "id", header: "id" },
          { accessorKey: "name", header: "nombre" },
          { accessorKey: "email", header: "correo" },
          { accessorKey: "role.name", header: "rol" },
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
        exportFileName="usuarios"
        headerAction={{
          label: "Nuevo Usuario",
          icon: <Plus size={18} />,
          onClick: () => navigate("/users/create"),
        }}
      />
    </div>
  );
}
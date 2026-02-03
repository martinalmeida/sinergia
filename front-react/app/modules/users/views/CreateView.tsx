import BtnBaseComponent from "@shared/components/BtnBaseComponent";
import InputBase from "@shared/components/InputBaseComponent";
import LoaderComponent from "@shared/components/LoaderComponent";
import SelectBase from "@shared/components/SelectBaseComponent";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router";
import { useUser } from "../hooks";

const roles = [
  { label: "Admin", value: "1" },
  { label: "Editor", value: "2" },
];

export function CreateView() {
  const navigate = useNavigate();
  const {
    isLoading,
    form,
    setForm,
    handleRegister,
  } = useUser();

  if (isLoading) return <LoaderComponent />;
  return (
    <div className="space-y-4 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#273459] dark:text-gray-300 px-1">
          Crear Usuario
        </h1>
        <div>
          <BtnBaseComponent
            label="Cancelar"
            variant="secondary"
            icon={<ArrowLeft size="18" />}
            type="button"
            onClick={() => navigate("/users")}
          />
        </div>
      </div>
      <div className="mt-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre Completo
            </label>
            <InputBase
              placeholder="Ej: María Gómez"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo Electrónico
            </label>
            <InputBase
              placeholder="usuario@correo.com"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña
            </label>
            <InputBase
              placeholder="Contraseña segura (mínimo 8 caracteres)"
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rol
            </label>
            <SelectBase
              options={roles}
              value={form.role_id}
              onChange={(value) => setForm({ ...form, role_id: value })}
              placeholder="Selecciona un rol"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="w-full sm:w-64">
            <BtnBaseComponent
              label="Guardar Usuario"
              variant="primary"
              icon={<Save size="18" />}
              type="button"
              onClick={handleRegister}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
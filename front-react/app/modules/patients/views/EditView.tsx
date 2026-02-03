import BtnBaseComponent from "@shared/components/BtnBaseComponent";
import InputBase from "@shared/components/InputBaseComponent";
import LoaderComponent from "@shared/components/LoaderComponent";
import SelectBase from "@shared/components/SelectBaseComponent";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePatient } from "../hooks";
import { Patient } from "../interfaces";

export function EditView() {
  const navigate = useNavigate();
  const location = useLocation();
  const maybeState = location.state as { patient?: Patient } | null;
  const patientFromState = maybeState?.patient;

  const {
    hasFetched,
    isLoading,
    form,
    documentTypes,
    genders,
    departments,
    municipalities,
    setForm,
    getDocumentTypes,
    getGenders,
    getDepartments,
    getMunicipalities,
    handleUpdate,
  } = usePatient();

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getDocumentTypes();
      getGenders();
      getDepartments();

      if (patientFromState) {
        getMunicipalities(patientFromState.department_id);
        setForm({
          document_type_id: String(patientFromState.document_type_id || ""),
          document_number: patientFromState.document_number || "",
          first_name: patientFromState.first_name || "",
          second_name: patientFromState.second_name || "",
          first_surname: patientFromState.first_surname || "",
          second_surname: patientFromState.second_surname || "",
          gender_id: String(patientFromState.gender_id || ""),
          department_id: String(patientFromState.department_id || ""),
          municipality_id: String(patientFromState.municipality_id || ""),
          email: patientFromState.email || "",
        });
      }
    }
  }, [getDocumentTypes, getGenders, getDepartments, getMunicipalities, patientFromState]);

  // Cuando cambie el departamento, cargar municipios
  useEffect(() => {
    if (form.department_id && form.department_id !== String(patientFromState?.department_id)) {
      getMunicipalities(Number(form.department_id));
      setForm({ ...form, municipality_id: "" });
    }
  }, [form.department_id]);

  if (isLoading) return <LoaderComponent />;
  return (
    <div className="space-y-4 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#273459] dark:text-gray-300 px-1">
          Editar Paciente
        </h1>
        <div>
          <BtnBaseComponent
            label="Cancelar"
            variant="secondary"
            icon={<ArrowLeft size="18" />}
            type="button"
            onClick={() => navigate("/patients")}
          />
        </div>
      </div>
      <div className="mt-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de Documento */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Documento <span className="text-red-500">*</span>
            </label>
            <SelectBase
              options={documentTypes.map((dt) => ({
                value: String(dt.id),
                label: `${dt.code} - ${dt.name}`,
              }))}
              value={form.document_type_id}
              onChange={(value) => setForm({ ...form, document_type_id: value })}
              placeholder="Selecciona tipo de documento"
            />
          </div>

          {/* Número de Documento */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Número de Documento <span className="text-red-500">*</span>
            </label>
            <InputBase
              placeholder="1234567890"
              value={form.document_number}
              onChangeText={(text) => setForm({ ...form, document_number: text })}
            />
          </div>

          {/* Primer Nombre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Primer Nombre <span className="text-red-500">*</span>
            </label>
            <InputBase
              placeholder="Ej: Juan"
              value={form.first_name}
              onChangeText={(text) => setForm({ ...form, first_name: text })}
            />
          </div>

          {/* Segundo Nombre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Segundo Nombre
            </label>
            <InputBase
              placeholder="Ej: Carlos"
              value={form.second_name}
              onChangeText={(text) => setForm({ ...form, second_name: text })}
            />
          </div>

          {/* Primer Apellido */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Primer Apellido <span className="text-red-500">*</span>
            </label>
            <InputBase
              placeholder="Ej: Pérez"
              value={form.first_surname}
              onChangeText={(text) => setForm({ ...form, first_surname: text })}
            />
          </div>

          {/* Segundo Apellido */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Segundo Apellido
            </label>
            <InputBase
              placeholder="Ej: García"
              value={form.second_surname}
              onChangeText={(text) => setForm({ ...form, second_surname: text })}
            />
          </div>

          {/* Género */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Género <span className="text-red-500">*</span>
            </label>
            <SelectBase
              options={genders.map((g) => ({
                value: String(g.id),
                label: g.name,
              }))}
              value={form.gender_id}
              onChange={(value) => setForm({ ...form, gender_id: value })}
              placeholder="Selecciona género"
            />
          </div>

          {/* Correo Electrónico */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <InputBase
              placeholder="paciente@correo.com"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
          </div>

          {/* Departamento */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Departamento <span className="text-red-500">*</span>
            </label>
            <SelectBase
              options={departments.map((d) => ({
                value: String(d.id),
                label: d.name,
              }))}
              value={form.department_id}
              onChange={(value) => setForm({ ...form, department_id: value })}
              placeholder="Selecciona departamento"
            />
          </div>

          {/* Municipio */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Municipio <span className="text-red-500">*</span>
            </label>
            <SelectBase
              options={municipalities.map((m) => ({
                value: String(m.id),
                label: m.name,
              }))}
              value={form.municipality_id}
              onChange={(value) => setForm({ ...form, municipality_id: value })}
              placeholder="Selecciona municipio"
              disabled={!form.department_id}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="w-full sm:w-64">
            <BtnBaseComponent
              label="Actualizar Paciente"
              variant="primary"
              icon={<Save size="18" />}
              type="button"
              onClick={() => patientFromState && handleUpdate(patientFromState.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
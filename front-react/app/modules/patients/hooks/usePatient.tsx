import { validarForm } from "@shared/helpers";
import { ToastAlert } from "@shared/utils";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  patientsService,
  registerPatientService,
  updatePatientService,
  deletePatientService,
  documentTypesService,
  gendersService,
  departmentsService,
  municipalitiesService,
} from "../services";
import { usePatientStore } from "../store";

export function usePatient() {
  const navigate = useNavigate();

  const hasFetched = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    document_type_id: "" as string,
    document_number: "" as string,
    first_name: "" as string,
    second_name: "" as string,
    first_surname: "" as string,
    second_surname: "" as string,
    gender_id: "" as string,
    department_id: "" as string,
    municipality_id: "" as string,
    email: "" as string,
  });

  //Estados globales
  const patients = usePatientStore((state) => state.patients);
  const setPatients = usePatientStore((state) => state.setPatients);
  const pagination = usePatientStore((state) => state.pagination);
  const setPagination = usePatientStore((state) => state.setPagination);
  const documentTypes = usePatientStore((state) => state.documentTypes);
  const setDocumentTypes = usePatientStore((state) => state.setDocumentTypes);
  const genders = usePatientStore((state) => state.genders);
  const setGenders = usePatientStore((state) => state.setGenders);
  const departments = usePatientStore((state) => state.departments);
  const setDepartments = usePatientStore((state) => state.setDepartments);
  const municipalities = usePatientStore((state) => state.municipalities);
  const setMunicipalities = usePatientStore((state) => state.setMunicipalities);

  //Obtenemos los pacientes
  const getPatients = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      const response = await patientsService(page);

      if (response.status && response.data) {
        const { data, ...paginationInfo } = response.data;
        setPatients(data || []);
        setPagination(paginationInfo);
        setIsLoading(false);
      } else {
        ToastAlert("Error", response.message, "error", 2000);
        setIsLoading(false);
        return [];
      }
    },
    [setPatients, setPagination]
  );

  const getPatient = useCallback(
    async (id: number) => {
      return patients.find((p) => p.id === id) || null;
    },
    [patients]
  );

  //Obtener catálogos
  const getDocumentTypes = useCallback(async () => {
    const response = await documentTypesService();
    if (response.status && response.data) {
      setDocumentTypes(response.data);
    }
  }, [setDocumentTypes]);

  const getGenders = useCallback(async () => {
    const response = await gendersService();
    if (response.status && response.data) {
      setGenders(response.data);
    }
  }, [setGenders]);

  const getDepartments = useCallback(async () => {
    const response = await departmentsService();
    if (response.status && response.data) {
      setDepartments(response.data);
    }
  }, [setDepartments]);

  const getMunicipalities = useCallback(
    async (departmentId?: number) => {
      const response = await municipalitiesService(departmentId);
      if (response.status && response.data) {
        setMunicipalities(response.data);
      }
    },
    [setMunicipalities]
  );

  //Registro de pacientes
  const handleRegister = useCallback(async () => {
    if (!validarForm(form)) return;
    setIsLoading(true);
    const response = await registerPatientService({
      document_type_id: Number(form.document_type_id),
      document_number: form.document_number,
      first_name: form.first_name,
      second_name: form.second_name,
      first_surname: form.first_surname,
      second_surname: form.second_surname,
      gender_id: Number(form.gender_id),
      department_id: Number(form.department_id),
      municipality_id: Number(form.municipality_id),
      email: form.email,
    });

    if (response.status) {
      await getPatients();
      navigate("/patients");
      ToastAlert("Éxito", response.message, "success", 2000);
    } else {
      ToastAlert("Error", response.message, "error", 2000);
    }
    setIsLoading(false);
  }, [form, navigate, getPatients]);

  //Actualizacion de pacientes
  const handleUpdate = useCallback(
    async (id: number) => {
      setIsLoading(true);
      const response = await updatePatientService({
        id,
        document_type_id: Number(form.document_type_id),
        document_number: form.document_number,
        first_name: form.first_name,
        second_name: form.second_name,
        first_surname: form.first_surname,
        second_surname: form.second_surname,
        gender_id: Number(form.gender_id),
        department_id: Number(form.department_id),
        municipality_id: Number(form.municipality_id),
        email: form.email,
      });

      if (response.status) {
        await getPatients();
        navigate("/patients");
        ToastAlert("Éxito", response.message, "success", 2000);
      } else {
        ToastAlert("Error", response.message, "error", 2000);
      }
      setIsLoading(false);
    },
    [form, navigate, getPatients]
  );

  //Eliminar paciente
  const handleDelete = useCallback(
    async (id: number) => {
      setIsLoading(true);
      const response = await deletePatientService(id);
      if (response.status) {
        await getPatients();
        ToastAlert("Éxito", response.message, "success", 2000);
      } else {
        ToastAlert("Error", response.message, "error", 2000);
      }
      setIsLoading(false);
    },
    [getPatients]
  );

  //Regresar
  const backRoute = useCallback(() => {
    navigate("/patients");
  }, [navigate]);

  //Memorizacion y retorno
  return useMemo(
    () => ({
      hasFetched,
      isLoading,
      patients,
      pagination,
      documentTypes,
      genders,
      departments,
      municipalities,
      form,
      setIsLoading,
      setForm,
      getPatients,
      getPatient,
      getDocumentTypes,
      getGenders,
      getDepartments,
      getMunicipalities,
      handleRegister,
      handleUpdate,
      handleDelete,
      backRoute,
    }),
    [
      hasFetched,
      isLoading,
      patients,
      pagination,
      documentTypes,
      genders,
      departments,
      municipalities,
      form,
      setIsLoading,
      setForm,
      getPatients,
      getPatient,
      getDocumentTypes,
      getGenders,
      getDepartments,
      getMunicipalities,
      handleRegister,
      handleUpdate,
      handleDelete,
      backRoute,
    ]
  );
}
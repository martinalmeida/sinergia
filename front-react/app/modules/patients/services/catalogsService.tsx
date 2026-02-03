import { unauthorized, formatApiError } from "@shared/helpers";
import { useSessionStore } from "@shared/store";
import { constApiUtils } from "@shared/utils";
import axios, { AxiosError } from "axios";
import { DocumentType, Gender, Department, Municipality } from "../interfaces";

export async function documentTypesService() {
  try {
    const { jwt } = useSessionStore.getState();

    const response = await axios.get<DocumentType[]>(
      `${constApiUtils.urlBase}document-types`,
      {
        headers: {
          "Content-Type": `${constApiUtils.contentType}`,
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return {
      message: "Tipos de documento obtenidos",
      data: response.data,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    await unauthorized(axiosError?.response?.status as number);
    return formatApiError(error);
  }
}

export async function gendersService() {
  try {
    const { jwt } = useSessionStore.getState();

    const response = await axios.get<Gender[]>(
      `${constApiUtils.urlBase}genders`,
      {
        headers: {
          "Content-Type": `${constApiUtils.contentType}`,
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return {
      message: "Géneros obtenidos",
      data: response.data,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    await unauthorized(axiosError?.response?.status as number);
    return formatApiError(error);
  }
}

export async function departmentsService() {
  try {
    const { jwt } = useSessionStore.getState();

    const response = await axios.get<Department[]>(
      `${constApiUtils.urlBase}departments`,
      {
        headers: {
          "Content-Type": `${constApiUtils.contentType}`,
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return {
      message: "Departamentos obtenidos",
      data: response.data,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    await unauthorized(axiosError?.response?.status as number);
    return formatApiError(error);
  }
}

export async function municipalitiesService(departmentId?: number) {
  try {
    const { jwt } = useSessionStore.getState();

    const url = departmentId 
      ? `${constApiUtils.urlBase}municipalities?department_id=${departmentId}`
      : `${constApiUtils.urlBase}municipalities`;

    const response = await axios.get<Municipality[]>(url, {
      headers: {
        "Content-Type": `${constApiUtils.contentType}`,
        Authorization: `Bearer ${jwt}`,
      },
    });

    return {
      message: "Municipios obtenidos",
      data: response.data,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    await unauthorized(axiosError?.response?.status as number);
    return formatApiError(error);
  }
}
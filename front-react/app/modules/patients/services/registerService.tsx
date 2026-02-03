import { unauthorized, formatApiError } from "@shared/helpers";
import { useSessionStore } from "@shared/store";
import { constApiUtils } from "@shared/utils";
import axios, { AxiosError } from "axios";

export interface RegisterPatientServiceProps {
  document_type_id: number;
  document_number: string;
  first_name: string;
  second_name: string;
  first_surname: string;
  second_surname: string;
  gender_id: number;
  department_id: number;
  municipality_id: number;
  email: string;
}

export async function registerPatientService(data: RegisterPatientServiceProps) {
  try {
    const { jwt } = useSessionStore.getState();

    const response = await axios.post(
      `${constApiUtils.urlBase}patients`,
      data,
      {
        headers: {
          "Content-Type": `${constApiUtils.contentType}`,
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return {
      message: response.data.message || "Paciente creado exitosamente",
      data: response.data.patient,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    await unauthorized(axiosError?.response?.status as number);
    return formatApiError(error);
  }
}
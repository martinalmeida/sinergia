import { unauthorized, formatApiError } from "@shared/helpers";
import { useSessionStore } from "@shared/store";
import { constApiUtils } from "@shared/utils";
import axios, { AxiosError } from "axios";

export interface UpdatePatientServiceProps {
  id: number;
  document_type_id?: number;
  document_number?: string;
  first_name?: string;
  second_name?: string;
  first_surname?: string;
  second_surname?: string;
  gender_id?: number;
  department_id?: number;
  municipality_id?: number;
  email?: string;
}

export async function updatePatientService({ id, ...data }: UpdatePatientServiceProps) {
  try {
    const { jwt } = useSessionStore.getState();

    const response = await axios.put(
      `${constApiUtils.urlBase}patients/${id}`,
      data,
      {
        headers: {
          "Content-Type": `${constApiUtils.contentType}`,
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return {
      message: response.data.message || "Paciente actualizado exitosamente",
      data: response.data.patient,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    await unauthorized(axiosError?.response?.status as number);
    return formatApiError(error);
  }
}
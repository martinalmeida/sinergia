import axios, { AxiosError } from "axios";
import { constApiUtils } from "@shared/utils";
import { useSessionStore } from "@shared/store";
import { unauthorized, formatApiError } from "@shared/helpers";
import { PaginatedResponse, Patient } from "../../patients/interfaces";

export async function searchPatientsService(query: string, signal?: AbortSignal) {
  try {
    const { jwt } = useSessionStore.getState();

    const response = await axios.get<PaginatedResponse<Patient>>(
      `${constApiUtils.urlBase}patients`, 
      {
        params: { search: query }, //Enviamos como query param limpio
        signal: signal, //Conectamos el abort controller
        headers: {
          "Content-Type": `${constApiUtils.contentType}`,
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return {
      status: true,
      data: response.data.data,
      message: "Resultados obtenidos",
    };
  } catch (error: unknown) {
    //Si el error es por cancelación (abort), no lo tratamos como error real
    if (axios.isCancel(error)) {
      throw error; 
    }

    const axiosError = error as AxiosError<{ error?: string }>;
    await unauthorized(axiosError?.response?.status as number);
    return formatApiError(error);
  }
}
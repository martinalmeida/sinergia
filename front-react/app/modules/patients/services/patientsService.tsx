import { unauthorized, formatApiError } from "@shared/helpers";
import { useSessionStore } from "@shared/store";
import { constApiUtils } from "@shared/utils";
import axios, { AxiosError } from "axios";
import { PaginatedResponse, Patient } from "../interfaces";

export async function patientsService(page: number = 1) {
  try {
    const { jwt } = useSessionStore.getState();

    const response = await axios.get<PaginatedResponse<Patient>>(
      `${constApiUtils.urlBase}patients?page=${page}`,
      {
        headers: {
          "Content-Type": `${constApiUtils.contentType}`,
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return {
      message: "Pacientes obtenidos con éxito",
      data: response.data,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    await unauthorized(axiosError?.response?.status as number);
    return formatApiError(error);
  }
}
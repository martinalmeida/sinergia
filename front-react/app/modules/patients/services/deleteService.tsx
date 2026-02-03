import { unauthorized, formatApiError } from "@shared/helpers";
import { useSessionStore } from "@shared/store";
import { constApiUtils } from "@shared/utils";
import axios, { AxiosError } from "axios";

export async function deletePatientService(id: number) {
  try {
    const { jwt } = useSessionStore.getState();

    const response = await axios.delete(
      `${constApiUtils.urlBase}patients/${id}`,
      {
        headers: {
          "Content-Type": `${constApiUtils.contentType}`,
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return {
      message: response.data.message || "Paciente eliminado exitosamente",
      data: null,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    await unauthorized(axiosError?.response?.status as number);
    return formatApiError(error);
  }
}
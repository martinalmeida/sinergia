import { useSessionStore } from "@shared/store";
import { constApiUtils } from "@shared/utils";
import axios, { AxiosError } from "axios";

export async function logoutService() {
  try {
    const { jwt } = useSessionStore.getState();

    await axios.post(
      `${constApiUtils.urlBase}logout`,
      {},
      {
        headers: {
          "Content-Type": `${constApiUtils.contentType}`,
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    
    await useSessionStore.getState().clearSession();

    return {
      message: "Sesión cerrada con éxito",
      data: null,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    return {
      message: axiosError.response?.data?.error || axiosError.message,
      data: null,
      status: false,
    };
  }
}
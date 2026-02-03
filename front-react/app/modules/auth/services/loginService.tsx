import { useSessionStore } from "@shared/store";
import { constApiUtils } from "@shared/utils";
import axios, { AxiosError } from "axios";

export interface LoginServiceProps {
  usuUsua: string;
  usuPass: string;
}

export async function loginService({ usuUsua, usuPass }: LoginServiceProps) {
  try {
    const response = await axios.post(
      `${constApiUtils.urlBase}login`,
      {
        email: usuUsua,
        password: usuPass,
      },
      {
        headers: {
          "Content-Type": `${constApiUtils.contentType}`,
        },
      },
    );
    await useSessionStore.getState().setSession({
      usuPerf: String(response.data.user.role.id),
      usuNomb: String(response.data.user.name),
      jwt: String(response.data.access_token),
    });

    return {
      message: `Bienvenido ${response.data.user.name}`,
      data: response.data,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    return {
      message: JSON.stringify(axiosError.message),
      data: null,
      status: false,
    };
  }
}
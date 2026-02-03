import { unauthorized, formatApiError } from "@shared/helpers";
import { useSessionStore } from "@shared/store";
import { constApiUtils } from "@shared/utils";
import axios, { AxiosError } from "axios";

export interface RegisterServiceProps {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

export async function registerService({
  name,
  email,
  password,
  role_id,
}: RegisterServiceProps) {
  try {
    const { jwt } = useSessionStore.getState();

    const response = await axios.post(
      `${constApiUtils.urlBase}users`,
      {
        name,
        email,
        password,
        role_id,
      },
      {
        headers: {
          "Content-Type": `${constApiUtils.contentType}`,
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return {
      message: response.data.message || `Usuario ${name} creado exitosamente`,
      data: response.data.user,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    await unauthorized(axiosError?.response?.status as number);
    return formatApiError(error);
  }
}
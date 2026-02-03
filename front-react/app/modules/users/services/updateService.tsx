import { unauthorized, formatApiError } from "@shared/helpers";
import { useSessionStore } from "@shared/store";
import { constApiUtils } from "@shared/utils";
import axios, { AxiosError } from "axios";

export interface UpdateServiceProps {
  id: number;
  name?: string;
  role_id?: number;
}

export async function updateService({
  id,
  name,
  role_id,
}: UpdateServiceProps) {
  try {
    const { jwt } = useSessionStore.getState();

    const response = await axios.put(
      `${constApiUtils.urlBase}users/${id}`,
      {
        name,
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
      message: response.data.message || `Usuario actualizado exitosamente`,
      data: response.data.user,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    await unauthorized(axiosError?.response?.status as number);
    return formatApiError(error);
  }
}
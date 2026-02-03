import { unauthorized, formatApiError } from "@shared/helpers";
import { useSessionStore } from "@shared/store";
import { constApiUtils } from "@shared/utils";
import axios, { AxiosError } from "axios";
import { PaginatedResponse, User } from "../interfaces"; // ajusta la ruta

export async function usersService(page: number = 1) {
  try {
    const { jwt } = useSessionStore.getState();

    const response = await axios.get<PaginatedResponse<User>>(
      `${constApiUtils.urlBase}users?page=${page}`,
      {
        headers: {
          "Content-Type": `${constApiUtils.contentType}`,
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return {
      message: "Usuarios obtenidos con éxito",
      data: response.data,
      status: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: string }>;
    await unauthorized(axiosError?.response?.status as number);
    return formatApiError(error);
  }
}
import { AxiosError } from "axios";

export type StandardErrorResponse = {
  message: string;
  data: null;
  status: false;
};

export function formatApiError<T = { detail?: unknown }>(
  error: unknown,
  fallback = "Error desconocido",
): StandardErrorResponse {
  const axiosError = error as AxiosError<T> | undefined;

  const status = axiosError?.response?.status;
  const is4xx = typeof status === "number" && status >= 400 && status < 500;

  //intentar obtener detail si existe (y convertirlo a string)
  const maybeDetail =
    axiosError?.response?.data && (axiosError.response.data as any).detail;

  const message =
    is4xx && maybeDetail != null
      ? //si detail es objeto o no-string, lo convertimos a string de forma segura
        typeof maybeDetail === "string"
        ? maybeDetail
        : String(maybeDetail)
      : //fallback al message de axios o al fallback pasado
        axiosError?.message
        ? String(axiosError.message)
        : fallback;

  return {
    message,
    data: null,
    status: false,
  };
}
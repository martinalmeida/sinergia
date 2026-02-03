import { useSessionStore } from "../store";

export async function unauthorized(status: number) {
  if (status === 401) {
    await useSessionStore.getState().clearSession();
    window.location.href = '/';
    return;
  }
  return true;
}
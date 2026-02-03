import { EditView } from "../views/EditView";
import type { Route } from "./+types/edit";
import { checkRouteAccess } from "@shared/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Editar Paciente - Sinergia" },
    { name: "description", content: "Editar paciente" },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  checkRouteAccess(url.pathname);
  return null;
}

export default function EditPatientRoute() {
  return <EditView />;
}
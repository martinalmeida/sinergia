import { CreateView } from "../views/CreateView";
import type { Route } from "./+types/create";
import { checkRouteAccess } from "@shared/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crear Paciente - Sinergia" },
    { name: "description", content: "Crear nuevo paciente" },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  checkRouteAccess(url.pathname);
  return null;
}

export default function CreatePatientRoute() {
  return <CreateView />;
}
import { HomeView } from "../views/HomeView";
import type { Route } from "./+types/index";
import { checkRouteAccess } from "@shared/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Inicio - SpeGasto" },
    { name: "description", content: "Inicio de SpeGasto" },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  checkRouteAccess(url.pathname);
  return null;
}

export default function HomeRoute() {
  return <HomeView />;
}
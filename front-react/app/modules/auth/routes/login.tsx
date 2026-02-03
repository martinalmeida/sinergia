import { Login } from "../components/LoginForm";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Sinergia" },
    { name: "description", content: "Sign in to your account" },
  ];
}

export default function LoginRoute() {
  return <Login />;
}
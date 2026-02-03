import {
  Home,
  Users,
  HeartHandshake,
  UserSearch
} from "lucide-react";
import React from "react";

export interface ModuleConfig {
  name: string;
  title: string;
  path: string;
  icon: React.ReactElement;
}

export const allowedModules: Record<string, ModuleConfig[]> = {
  //Rol admin
  1: [
    {
      name: "home",
      title: "Inicio",
      path: "/home",
      icon: <Home size={20} />,
    },
    {
      name: "users",
      title: "Usuarios",
      path: "/users",
      icon: <Users size={20} />,
    },
    {
      name: "patients",
      title: "Pacientes",
      path: "/patients",
      icon: <HeartHandshake size={20} />,
    }
  ],
  //Rol consulta
  2: [
    {
      name: "home",
      title: "Inicio",
      path: "/home",
      icon: <Home size={20} />,
    },
    {
      name: "search",
      title: "Buscar pacientes",
      path: "/search",
      icon: <UserSearch size={20} />,
    },
  ],
};
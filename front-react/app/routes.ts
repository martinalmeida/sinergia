import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("./modules/auth/routes/login.tsx"),

  layout("./shared/layouts/DashboardLayout.tsx", [
    // Rutas del módulo home
    route("home", "./modules/home/routes/index.tsx"),
    
    // Rutas del módulo users
    route("users", "./modules/users/routes/index.tsx"),
    route("users/create", "./modules/users/routes/create.tsx"),
    route("users/edit", "./modules/users/routes/edit.tsx"),
    
    // Rutas del módulo patients
    route("patients", "./modules/patients/routes/index.tsx"),
    route("patients/create", "./modules/patients/routes/create.tsx"),
    route("patients/edit", "./modules/patients/routes/edit.tsx"),
  ]),

  route("*", "./shared/routes/404.tsx"),
] satisfies RouteConfig;
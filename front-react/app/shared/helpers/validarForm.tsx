import Swal from "sweetalert2";

export function validarForm(
  data: Record<string, string>,
  opcionales: string[] = []
): boolean {
  const faltantes: string[] = [];

  for (const [clave, valor] of Object.entries(data)) {
    if (opcionales.includes(clave)) continue;

    const esVacio =
      valor === null ||
      valor === undefined ||
      (typeof valor === "string" && valor.trim() === "") ||
      (typeof valor === "number" && isNaN(valor)) ||
      (typeof valor === "boolean" && valor === false);

    if (esVacio) {
      faltantes.push(clave);
    }
  }

  if (faltantes.length > 0) {
    const mensaje = `Ingrese a ${faltantes.join(", ")}`;

    Swal.fire({
      title: "Campos requeridos",
      text: mensaje,
      icon: "warning",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    return false;
  }

  return true;
}
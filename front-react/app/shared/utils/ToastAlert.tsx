import Swal from "sweetalert2";

function cleanMensaje(mensaje: string): string {
  if (!mensaje || typeof mensaje !== "string") return mensaje;
  const trimmed = mensaje.trim();
  const hasDoubleQuotes = trimmed.startsWith('"') && trimmed.endsWith('"');
  const hasSingleQuotes = trimmed.startsWith("'") && trimmed.endsWith("'");

  if (hasDoubleQuotes || hasSingleQuotes) {
    const doubleQuotedJsonLiteral = /^"(?:\\.|[^"\\])*"$/;
    if (hasDoubleQuotes && doubleQuotedJsonLiteral.test(trimmed)) {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "string") return parsed;
    }
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

const PALETTE: Record<
  "success" | "warn" | "error" | "info",
  { background: string; accent: string; text: string; muted: string }
> = {
  success: {
    background: "#E8F5E9",
    accent: "#2E7D32",
    text: "#1B5E20",
    muted: "rgba(27,94,32,0.7)",
  },
  warn: {
    background: "#FFF8E1",
    accent: "#F9A825",
    text: "#8A4B0A",
    muted: "rgba(138,75,10,0.7)",
  },
  error: {
    background: "#FFEBEE",
    accent: "#C62828",
    text: "#7F1D1D",
    muted: "rgba(127,29,29,0.7)",
  },
  info: {
    background: "#E3F2FD",
    accent: "#1565C0",
    text: "#0B3A66",
    muted: "rgba(11,58,102,0.7)",
  },
};

function getSweetAlertIcon(
  alertType: "success" | "warn" | "error" | "info"
): "success" | "error" | "warning" | "info" {
  switch (alertType) {
    case "success":
      return "success";
    case "warn":
      return "warning";
    case "error":
      return "error";
    case "info":
    default:
      return "info";
  }
}

export async function ToastAlert(
  title: string,
  mensaje: string,
  type: "success" | "warn" | "error" | "info",
  duration = 3400
): Promise<void> {
  const description = cleanMensaje(mensaje);
  const colors = PALETTE[type];
  const icon = getSweetAlertIcon(type);

  const timer = duration > 0 ? duration : undefined;

  await Swal.fire({
    toast: true,
    position: "top-end",
    icon: icon,
    title: title,
    text: description,
    timer: timer,
    timerProgressBar: true,
    showConfirmButton: false,
    showCloseButton: true,
    width: "min(600px, 92vw)",
    padding: "0.6rem 1rem",
    background: colors.background,
    color: colors.text,
    iconColor: colors.accent,
    showClass: {
      popup: "swal2-show swal2-animate",
    },
    hideClass: {
      popup: "swal2-hide swal2-animate",
    },
  });
}

export async function ToastAlertWithButton(
  title: string,
  mensaje: string,
  type: "success" | "warn" | "error" | "info"
): Promise<void> {
  const description = cleanMensaje(mensaje);
  const colors = PALETTE[type];
  const icon = getSweetAlertIcon(type);

  await Swal.fire({
    toast: false,
    position: "top-end",
    icon: icon,
    title: title,
    text: description,
    confirmButtonText: "Aceptar",
    confirmButtonColor: colors.accent,
    showCloseButton: true,
    width: "min(640px, 92vw)",
    padding: "0.75rem 1.25rem",
    background: colors.background,
    color: colors.text,
    iconColor: colors.accent,
    showClass: {
      popup: "swal2-show swal2-animate",
    },
    hideClass: {
      popup: "swal2-hide swal2-animate",
    },
  });
}
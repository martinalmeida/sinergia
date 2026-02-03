import loadingData from "@/assets/loading.json";
import { useDarkMode } from "@shared/hooks/useDarkMode";
import Lottie from "lottie-react";
import { ClientOnly } from "./ClientOnly";

export default function LoaderComponent() {
  const { darkMode, isMounted } = useDarkMode();

  const mountedAndDark = isMounted && darkMode;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-200
        ${mountedAndDark ? "bg-gray-900" : "bg-[#F2F2F2]"}`}
    >
      <div
        style={{
          width: 180,
          height: 180,
          filter: mountedAndDark ? "invert(1) hue-rotate(180deg)" : "none",
        }}
      >
        <ClientOnly>
          <Lottie animationData={loadingData} loop autoplay />
        </ClientOnly>
      </div>
    </div>
  );
}
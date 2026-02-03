import animation from "@/assets/home.json";
import { ClientOnly } from "@shared/components/ClientOnly";
import Lottie from "lottie-react";

export function HomeView() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-500 px-6 py-2 rounded-2xl shadow-sm border border-gray-400 dark:border-slate-700">
        <div className="flex gap-2">
          <div className="w-[70%] my-auto">
            <h1 className="text-xl font-semibold text-[#273459]">
              Información del usuario
            </h1>
            <p className="text-xs text-gray-600">Bienvenido</p>
            <p className="text-[#273459]"></p>
          </div>
          <div className="w-[30%] flex justify-end my-auto">
            <ClientOnly>
              <Lottie
                style={{ width: 100 }}
                animationData={animation}
                loop={true}
                autoplay={true}
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  );
}
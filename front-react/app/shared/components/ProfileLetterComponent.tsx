import { useSessionStore } from "../store";

interface Props {
  width?: number;
  height?: number;
}

export default function ProfileLetterComponent({ width = 40, height = 40 }: Props) {
  const usuNomb = useSessionStore((state) => state.usuNomb);

  const letra = usuNomb ? usuNomb[0] : "";

  const size = Math.min(width, height);
  const fontSize = size * 0.5;

  return (
    <div className="flex items-center justify-center">
      <div
        className="bg-[#273459] rounded-full flex items-center justify-center cursor-pointer"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <span
          className="text-white font-bold uppercase"
          style={{ fontSize: `${fontSize}px` }}
        >
          {letra}
        </span>
      </div>
    </div>
  );
}
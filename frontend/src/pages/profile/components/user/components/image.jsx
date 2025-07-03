import { Pencil, User } from "lucide-react";

export default function Pic({ src }) {
  const hasImage = !!src; // verifica se src existe e não é vazio

  return (
    <div className="relative w-full aspect-square group">
      {hasImage ? (
        <img
          src={src}
          alt="Foto de perfil"
          className="w-full h-full rounded-full border-4 border-blue-600 shadow-[0_8px_30px_rgba(0,0,0,0.8)] object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full border-4 border-blue-600 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex items-center justify-center bg-gray-300">
          <User className="text-gray-600 w-12 h-12" />
        </div>
      )}

      <button
        type="button"
        className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => {
          console.log("click");
        }}
      >
        <Pencil className="text-white w-6 h-6" />
      </button>
    </div>
  );
}

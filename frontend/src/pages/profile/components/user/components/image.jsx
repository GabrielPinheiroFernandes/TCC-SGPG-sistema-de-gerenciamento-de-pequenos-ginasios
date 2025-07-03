import { useRef, useState } from "react";
import { Pencil, User } from "lucide-react";
import axios from "axios";
import urls from "../../../../../constants/urls";
import { User_token, User as UserStorageKey } from "../../../../../constants/localstorage";

export default function Pic({ src, onUploadSuccess }) {
  const [preview, setPreview] = useState(src);
  const inputFileRef = useRef(null);

  const handleClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const token = localStorage.getItem(User_token);
    const user = JSON.parse(localStorage.getItem(UserStorageKey) || "{}");
    const userId = user?.id;

    if (!userId || !token) {
      alert("Usuário não autenticado.");
      return;
    }

    reader.onloadend = async () => {
      const base64data = reader.result;

      try {
        const response = await axios.post(
          `${urls.UrlApi}/user/upload-photo`,
          {
            userId,
            photoBase64: base64data,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setPreview(base64data);
          onUploadSuccess?.(base64data);
          alert("Imagem enviada com sucesso!");
        } else {
          alert("Erro ao enviar imagem.");
        }
      } catch (err) {
        console.error("Erro ao enviar imagem:", err);
        alert("Erro ao enviar imagem.");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-full aspect-square group">
      {preview ? (
        <img
          src={preview}
          alt="Foto de perfil"
          className="w-full h-full rounded-full border-4 border-blue-600 shadow-[0_8px_30px_rgba(0,0,0,0.8)] object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full border-4 border-blue-600 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex items-center justify-center bg-gray-300">
          <User className="text-gray-600 w-12 h-12" />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={inputFileRef}
        onChange={handleFileChange}
      />

      <button
        type="button"
        className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleClick}
      >
        <Pencil className="text-white w-6 h-6" />
      </button>
    </div>
  );
}

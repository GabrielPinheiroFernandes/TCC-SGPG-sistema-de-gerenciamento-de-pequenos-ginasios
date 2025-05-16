import React, { useState } from "react";
import axios from "axios";
import images from "../constants/images"; // use o mesmo sistema de imagens que você já usa
import api from "../constants/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(api.Url+"/auth/login",{
        email,
        password,
      });
      console.log(response.data);
      setMensagem("Login realizado com sucesso!");
    } catch (err) {
      setMensagem("Erro ao fazer login. Verifique os dados.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black">
      {/* Banner superior com imagem */}
      <section
        className="w-full h-[60vh] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${images.banner})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center">
            ÁREA DO <span className="text-blue-800">USUÁRIO</span>
          </h1>
        </div>
      </section>

      {/* Formulário de Login */}
      <section className="w-full flex justify-center items-center py-12 px-4 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            FAÇA <span className="text-blue-800">LOGIN</span>
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded border border-gray-300"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded border border-gray-300"
              required
            />
            <button
              type="submit"
              className="bg-blue-800 text-white py-3 rounded hover:bg-blue-700 font-semibold"
            >
              ENTRAR
            </button>
            {mensagem && (
              <p className="text-center text-sm text-red-600 font-semibold mt-2">{mensagem}</p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

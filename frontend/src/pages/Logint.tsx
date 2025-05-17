import React, { useState } from "react";
import axios from "axios";
import images from "../constants/images"; // mantido

// Instância personalizada do Axios
const api = axios.create({
  baseURL: "http://172.23.16.1:8080", // ✅ coloque a URL certa da sua API
  headers: {
    "Content-Type": "application/json",
  },
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("Fazendo login...");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log(response.data);
      
      setMensagem("✅ Login realizado com sucesso!");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setMensagem(`❌ ${error.response.data.message}`);
      } else {
        setMensagem(`❌ Erro ao fazer login. Verifique seus dados. ${error}`);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black">
      {/* Banner superior com imagem */}
      <section
        className="w-full h-[40vh] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${images.banner})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center drop-shadow-lg">
            ÁREA DO <span className="text-blue-800">USUÁRIO</span>
          </h1>
        </div>
      </section>

      {/* Formulário */}
      <section className="w-full flex justify-center items-center py-16 px-4 bg-white">
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            FAÇA <span className="text-blue-800">LOGIN</span>
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
              required
            />
            <button
              type="submit"
              className="bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              ENTRAR
            </button>
            {mensagem && (
              <p className="text-center text-sm font-medium mt-2 text-red-600">
                {mensagem}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

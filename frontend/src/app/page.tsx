"use client"; // Marca o componente como um client component

import { useState, useEffect } from "react";

export default function Home() {
  // Variáveis de estado
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Limpar erro anterior
    setError(null);

    try {
      // Requisição de login
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // Garante que a resposta seja JSON
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Verifica se o token foi retornado
      if (data && data.access_token) {
        // Armazena o token no localStorage
        localStorage.setItem("token", data.access_token);
        console.log("Login bem-sucedido!");
        console.log(data)
      } else {
        setError("Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição", error);
      setError("Erro na requisição");
    }
  };

  // Função para limpar o localStorage
  const handleClearStorage = () => {
    localStorage.removeItem("token");
    console.log("Token removido do localStorage");
  };

  // Verifica se já existe um token armazenado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setError("Você já está logado!");
    }
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-4xl font-semibold text-blue-600 mb-4">Login screen</h1>

        {/* Mostra a mensagem de erro ou sucesso */}
        {error && (
          <div
            className={`mb-4 p-2 text-white ${
              error === "Você já está logado!" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Enviar
          </button>
        </form>

        {/* Botão para limpar o localStorage */}
        <button
          onClick={handleClearStorage}
          className="mt-4 w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Limpar Token
        </button>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";
import images from "../constants/images"; // mantido
import urls from "../constants/urls";
import InputText from "../components/InputText";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: urls.UrlApi,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function Register() {
  const navigate = useNavigate();

  // Campos independentes
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMensagem("❌ As senhas não coincidem.");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        cpf,
        pass: password,
      });

      console.log(response.data);
      setMensagem("✅ Cadastro realizado com sucesso!");
      localStorage.setItem("token", response.data.user.token);
      navigate("/");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setMensagem(`❌ ${error.response.data.message}`);
      } else {
        setMensagem(`❌ Erro ao cadastrar. ${error.message}`);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-row">
      <section
        className="w-full bg-cover bg-center relative"
        style={{ height: "100vh" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div
            className="rounded-full absolute"
            style={{
              width: 300,
              height: 300,
              backgroundColor: "var(--primary-blue)",
              filter: "blur(80px)",
              boxShadow: "0 0 80px 40px var(--primary-blue)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.6,
              zIndex: 0,
            }}
          />
          <h1
            className="text-white text-4xl md:text-5xl font-bold text-center drop-shadow-lg relative z-10 px-4"
            style={{ opacity: 0.75, lineHeight: "1.2" }}
          >
            COMEÇE A TREINAR HOJE MESMO NA <br />
            <span className="text-blue-800 block">STUDIO FOCUS</span>
          </h1>
        </div>
      </section>

      {/* Formulário */}
      <section className="w-full flex justify-center items-center py-16 px-4 bg-white flex-col">
        <div className="flex flex-row gap-2 pb-20 items-center justify-center">
          <h1 className="text-gray-800 text-lg">Já possui uma conta ?</h1>
          <button
            style={{ backgroundColor: "var(--primary-blue)" }}
            className="text-white px-4 py-2 rounded-2xl hover:brightness-90 transition"
          >
            <a href="/login">Faça login</a>
          </button>
        </div>

        <div className="w-full max-w-[800px] bg-white border border-gray-200 shadow-xl rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            FAÇA SEU <span className="text-blue-800">CADASTRO</span>
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="w-full flex-row flex gap-4">
              <InputText
                type="text"
                label="Primeiro Nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <InputText
                type="text"
                label="Segundo Nome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <InputText
              type="email"
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputText
              type="text"
              label="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />

            <div className="w-full flex-row flex gap-4">
              <InputText
                type="password"
                label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputText
                type="password"
                label="Confirmar Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              CADASTRAR
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

import React, { useState, useEffect } from "react";
import InputText from "../../../../components/InputText";
import { User } from "../../../../constants/localstorage";
import Pic from "./components/image";

export default function UserProfile() {
  const user = localStorage.getItem(User);
  const userdata = user ? JSON.parse(user) : {};

  const originalData = {
    first_name: userdata.first_name || "",
    last_name: userdata.last_name || "",
    email: userdata.email || "",
    pass: userdata.pass || "",
    birth_date: userdata.birth_date ? userdata.birth_date.split("T")[0] : "",
    height: userdata.height?.toString() || "",
    weight: userdata.weight?.toString() || "",
    sex: userdata.sex || "",
    user_image: userdata.user_image || "",
    is_admin: userdata.is_admin || false,
  };

  const [formData, setFormData] = useState(originalData);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed = Object.keys(originalData).some(
      (key) => formData[key] !== originalData[key]
    );
    setHasChanges(changed);
  }, [formData, originalData]);

  function handleChange(field) {
    return (e) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };
  }

  function handleCancel() {
    setFormData(originalData);
  }

  function handleSave() {
    console.log("Salvando dados:", formData);
    // salvar no localStorage, chamar API, etc
  }

  function calculateIMC(weight, height) {
    if (!weight || !height) return "Preencha peso e altura";
    const peso = parseFloat(weight);
    const altura = parseFloat(height) / 100;
    if (isNaN(peso) || isNaN(altura) || altura === 0) return "Valores inválidos";
    const imc = peso / (altura * altura);
    return imc.toFixed(2);
  }

  function calculateTMB(weight, height, birth_date, sex) {
    if (!weight || !height || !birth_date || !sex)
      return "Preencha peso, altura, data de nascimento e sexo";

    const peso = parseFloat(weight);
    const altura = parseFloat(height);
    const idade = new Date().getFullYear() - new Date(birth_date).getFullYear();
    const sexoLower = sex.toLowerCase();

    if (isNaN(peso) || isNaN(altura) || isNaN(idade))
      return "Valores inválidos";

    if (sexoLower === "masculino" || sexoLower === "m") {
      return (10 * peso + 6.25 * altura - 5 * idade + 5).toFixed(2);
    } else if (sexoLower === "feminino" || sexoLower === "f") {
      return (10 * peso + 6.25 * altura - 5 * idade - 161).toFixed(2);
    } else {
      return "Sexo inválido (use M ou F)";
    }
  }

  function calculateCalorias(weight, height, birth_date, sex) {
    const tmb = parseFloat(calculateTMB(weight, height, birth_date, sex));
    if (isNaN(tmb)) return "Valores inválidos";
    return (tmb * 1.55).toFixed(2); // fator de atividade moderada
  }

  function estimateBF(weight, height, sex) {
    const imc = parseFloat(calculateIMC(weight, height));
    if (isNaN(imc)) return "Valores inválidos";

    const sexoLower = sex.toLowerCase();
    if (sexoLower === "masculino" || sexoLower === "m") {
      return (1.20 * imc + 0.23 * 25 - 10.8 * 1 - 5.4).toFixed(2); // idade fixa 25, sexo = 1
    } else if (sexoLower === "feminino" || sexoLower === "f") {
      return (1.20 * imc + 0.23 * 25 - 10.8 * 0 - 5.4).toFixed(2); // idade fixa 25, sexo = 0
    } else {
      return "Sexo inválido";
    }
  }

  return (
    <>
      <form className="flex flex-col md:flex-row h-screen w-screen">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 mb-6 md:mb-0 md:mt-10">
          <div className="w-lg h-lg mb-6">
            <Pic src={formData.user_image} />
          </div>
          <h1
            className="text-xl font-semibold"
            style={{
              fontFamily: "'Koulen', sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
            }}
          >
            {formData.first_name} {formData.last_name}
          </h1>
          <h2 className="text-lg text-gray-600">
            {formData.is_admin ? "Administrador" : "Aluno"}
          </h2>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
          {/* Campos de entrada */}
          <div className="flex flex-row gap-4 mb-4 w-full">
            <div className="flex-1">
              <InputText
                label="Primeiro Nome"
                value={formData.first_name}
                onChange={handleChange("first_name")}
              />
            </div>
            <div className="flex-1">
              <InputText
                label="Segundo Nome"
                value={formData.last_name}
                onChange={handleChange("last_name")}
              />
            </div>
          </div>

          <div className="flex flex-row gap-4 mb-4 w-full">
            <div className="flex-1">
              <InputText
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
              />
            </div>
            <div className="flex-1">
              <InputText
                label="Senha"
                type="password"
                value={formData.pass}
                onChange={handleChange("pass")}
              />
            </div>
          </div>

          <div className="flex flex-row gap-4 mb-4 w-full">
            <div className="flex-1">
              <InputText
                label="Data de Nascimento"
                type="date"
                value={formData.birth_date}
                onChange={handleChange("birth_date")}
              />
            </div>
            <div className="flex-1">
              <InputText
                label="Altura (cm)"
                type="number"
                value={formData.height}
                onChange={handleChange("height")}
              />
            </div>
          </div>

          <div className="flex flex-row gap-4 mb-4 w-full">
            <div className="flex-1">
              <InputText
                label="Peso (kg)"
                type="number"
                value={formData.weight}
                onChange={handleChange("weight")}
              />
            </div>
            <div className="flex-1">
              <InputText
                label="Sexo"
                type="text"
                value={formData.sex}
                onChange={handleChange("sex")}
              />
            </div>
          </div>

          {/* Cálculos */}
          <div className="flex flex-row gap-4 mb-4 w-full">
            <div className="flex-1">
              <label
                className="font-bold bg-gray-200 flex items-center justify-center rounded-2xl text-center p-2"
                style={{ fontFamily: "'Koulen', sans-serif" }}
              >
                Índice de Massa Corporal (IMC): {calculateIMC(formData.weight, formData.height)}
              </label>
            </div>
            <div className="flex-1">
              <label
                className="font-bold bg-gray-200 flex items-center justify-center rounded-2xl text-center p-2"
                style={{ fontFamily: "'Koulen', sans-serif" }}
              >
                Taxa Metabólica Basal (TMB): {calculateTMB(formData.weight, formData.height, formData.birth_date, formData.sex)}
              </label>
            </div>
          </div>

          <div className="flex flex-row gap-4 mb-4 w-full">
            <div className="flex-1">
              <label
                className="font-bold bg-gray-200 flex items-center justify-center rounded-2xl text-center p-2"
                style={{ fontFamily: "'Koulen', sans-serif" }}
              >
                Calorias diárias (estimadas): {calculateCalorias(formData.weight, formData.height, formData.birth_date, formData.sex)}
              </label>
            </div>
            <div className="flex-1">
              <label
                className="font-bold bg-gray-200 flex items-center justify-center rounded-2xl text-center p-2"
                style={{ fontFamily: "'Koulen', sans-serif" }}
              >
                Estimativa de Gordura Corporal (BF%): {estimateBF(formData.weight, formData.height, formData.sex)}
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* Botões flutuantes */}
      {hasChanges && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            display: "flex",
            gap: 12,
            backgroundColor: "white",
            padding: "10px 20px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            style={{
              backgroundColor: "transparent",
              border: "1px solid var(--primary-blue)",
              color: "var(--primary-blue)",
              padding: "6px 12px",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              backgroundColor: "var(--primary-blue)",
              border: "none",
              color: "white",
              padding: "6px 12px",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Salvar
          </button>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../../../constants/localstorage";
import Pic from "../user/components/image";
import Card from "./components/card";

export default function AdminProfile() {
  const navigate = useNavigate();

  const user = localStorage.getItem(User);
  const userdata = user ? JSON.parse(user) : {};

  const originalData = {
    user_image: userdata.user_image || "",
    first_name: userdata.first_name || "",
    last_name: userdata.last_name || "",
    is_admin: userdata.is_admin || false,
  };

  const [formData, setFormData] = useState(originalData);
  const studentsHandler = () => {
    navigate("/students");
  };
   const dashboardsHandler = () => {
    navigate("/dashboard");
  };
  useEffect(() => {
    setFormData(originalData);
  }, [user]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Esquerda: 30% em md+ */}
      <div className="w-full md:w-[30%] flex flex-col justify-center items-center bg-gray-100 p-6 gap-4">
        <div className="w-48 h-48 mb-6">
          <Pic src={formData.user_image} />
        </div>
        <h1
          className="text-xl font-semibold text-center"
          style={{
            fontFamily: "'Koulen', sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
          }}
        >
          {formData.first_name} {formData.last_name}
        </h1>
        <h2 className="text-lg text-gray-600 text-center">
          {formData.is_admin ? "Administrador" : "Aluno"}
        </h2>
      </div>

      {/* Direita: 70% em md+ */}
      <div className="w-full md:w-[70%] flex flex-wrap justify-center items-center p-6 gap-6">
        <div className="w-full sm:w-[80%] md:w-[45%] lg:w-[30%]">
          <Card label="Dashboard" onClick={dashboardsHandler}/>
        </div>
        <div className="w-full sm:w-[80%] md:w-[45%] lg:w-[30%]">
          <Card label="Alunos" onClick={studentsHandler} />
        </div>
      </div>
    </div>
  );
}

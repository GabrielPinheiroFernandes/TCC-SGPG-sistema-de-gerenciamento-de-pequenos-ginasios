import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, User_token } from "../../../../../../constants/localstorage";
import DashBoardAside from "../dashboard_aside";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const user = localStorage.getItem(User);
  const token = localStorage.getItem(User_token);
  const { first_name, user_image } = user ? JSON.parse(user) : {};
  const navigate = useNavigate();

  // Estados para dados da dashboard
  const [activeStudents, setActiveStudents] = useState(0);
  const [openPayments, setOpenPayments] = useState(0);
  const [studentsPerPeriod, setStudentsPerPeriod] = useState([]);

  const api = axios.create({
    baseURL: "sua_api_base_url_aqui",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Função para carregar dados (você substitui pelos seus endpoints)
  const fetchDashboardData = async () => {
    try {
      // Exemplo: pegar quantidade de alunos ativos
      // const resActive = await api.get("/alunos/ativos");
      // setActiveStudents(resActive.data.count);

      // Exemplo: pegar mensalidades em aberto
      // const resOpenPayments = await api.get("/mensalidades/abertas");
      // setOpenPayments(resOpenPayments.data.count);

      // Exemplo: pegar alunos por período (array de objetos com name e quantidade)
      // const resStudentsPerPeriod = await api.get("/alunos/periodo");
      // setStudentsPerPeriod(resStudentsPerPeriod.data);

      // Por enquanto valores fixos só para renderizar UI:
      setActiveStudents(10);
      setOpenPayments(5);
      setStudentsPerPeriod([
        { name: "Jan", alunos: 5 },
        { name: "Feb", alunos: 8 },
        { name: "Mar", alunos: 4 },
        { name: "Apr", alunos: 10 },
        { name: "May", alunos: 6 },
        { name: "Jun", alunos: 12 },
        { name: "Jul", alunos: 9 },
        { name: "Aug", alunos: 11 },
        { name: "Sep", alunos: 7 },
        { name: "Oct", alunos: 4 },
        { name: "Nov", alunos: 8 },
        { name: "Dec", alunos: 6 },
      ]);
    } catch (error) {
      console.error("Erro ao buscar dados da dashboard:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div
      className="flex flex-row w-full p-10 gap-6"
      style={{ background: "linear-gradient(180deg, #1352b9 0%, #3b5ba3 100%)" }}
    >
      {/* Sidebar */}
      <div className="w-[20%] bg-white rounded-3xl flex flex-col items-center py-10">
        <DashBoardAside name={first_name} pic={user_image} />
      </div>

      {/* Conteúdo principal */}
      <main className="flex flex-col flex-1 gap-6">
        {/* Top search bar e icones - opcional - pode adicionar depois */}

        {/* Cards */}
        <div className="flex gap-6">
          <div className="flex-1 bg-white rounded-3xl flex flex-col justify-center items-center py-12 px-6 shadow-md relative">
            <span className="text-3xl font-semibold">{activeStudents}</span>
            <span className="text-sm mt-1">Alunos Ativos</span>
            <div className="absolute top-4 right-4 text-blue-200 cursor-pointer select-none">↻</div>
          </div>

          <div className="flex-1 bg-white rounded-3xl flex flex-col justify-center items-center py-12 px-6 shadow-md relative">
            <span className="text-3xl font-semibold">{openPayments}</span>
            <span className="text-sm mt-1">Mensalidades em Aberto</span>
            <div className="absolute top-4 right-4 text-blue-200 cursor-pointer select-none">↻</div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded-3xl p-6 shadow-md h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studentsPerPeriod} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="alunos" fill="#a74173" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-gray-500 mt-2">Aluno Por Período</p>
        </div>
      </main>
    </div>
  );
}

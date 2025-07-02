import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, User_token } from "../../../../../../constants/localstorage";
import InputText from "../../../../../../components/InputText";
import DashBoardAside from "../dashboard_aside";
import urls from "../../../../../../constants/urls";

export default function Students() {
  const user = localStorage.getItem(User);
  const token = localStorage.getItem(User_token);
  const { first_name, user_image } = user ? JSON.parse(user) : {};
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    pass: "",
    birth_date: "",
    height: 0,
    weight: 0,
    sex: "",
    cpf: "",
  });

  const api = axios.create({
    baseURL: urls.UrlApi,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchStudents = async () => {
    try {
      const res = await api.get("/user/");
      const userList = res.data?.data || [];

      if (searchQuery.trim() === "") {
        setStudents(userList);
      } else {
        const filtered = userList.filter((user) =>
          `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
        setStudents(filtered);
      }
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setStudents([]);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(fetchStudents, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleClick = (id) => {
    navigate(`/students/${id}`);
  };

  const handleAddUser = async () => {
    const userToSend = {
      ...newUser,
      is_admin: false, // Forçado no envio
    };

    try {
      await api.post("/user/add", userToSend);
      setIsModalOpen(false);
      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        pass: "",
        birth_date: "",
        height: 0,
        weight: 0,
        sex: "",
        cpf: "",
      });
      fetchStudents();
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
    }
  };

  return (
    <div
      className="flex flex-row flex-1 w-full p-10 gap-4"
      style={{ background: "var(--primary-blue)" }}
    >
      <div className="w-[20%] flex flex-col justify-center items-center">
        <DashBoardAside name={first_name} pic={user_image} />
      </div>

      <main className="bg-white flex flex-1 flex-col rounded-2xl shadow-md p-8">
        <div className="mb-4 flex justify-between items-center">
          <InputText
            label="Digite o nome do Aluno"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            Adicionar Aluno
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-blue-500">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-blue-700 font-bold text-lg border-b border-blue-500">
                <th className="py-3 px-4">Nome</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">CPF</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 py-4">
                    Nenhum resultado
                  </td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr
                    key={student.id}
                    onClick={() => handleClick(student.id)}
                    className={`cursor-pointer transition-all duration-200 ${
                      index % 2 === 0
                        ? "bg-blue-700 text-white"
                        : "bg-white text-blue-700"
                    } hover:brightness-90`}
                  >
                    <td className="py-3 px-4 uppercase">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="py-3 px-4 uppercase">{student.email}</td>
                    <td className="py-3 px-4">{student.cpf}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl border w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-blue-700">
                Adicionar Novo Aluno
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Inputs - removendo is_admin e sex */}
                {Object.entries(newUser)
                  .filter(([key]) => key !== "sex")
                  .map(([key, value]) => {
                    let inputType = "text";
                    if (key === "pass") inputType = "password";
                    else if (key === "birth_date") inputType = "date";

                    return (
                      <InputText
                        key={key}
                        label={key.replace("_", " ").toUpperCase()}
                        type={inputType}
                        value={value}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                      />
                    );
                  })}

                {/* Botões de rádio para sexo */}
                <div className="flex items-center gap-6 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sex"
                      value="M"
                      checked={newUser.sex === "M"}
                      onChange={() =>
                        setNewUser((prev) => ({ ...prev, sex: "M" }))
                      }
                    />
                    Masculino
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sex"
                      value="F"
                      checked={newUser.sex === "F"}
                      onChange={() =>
                        setNewUser((prev) => ({ ...prev, sex: "F" }))
                      }
                    />
                    Feminino
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

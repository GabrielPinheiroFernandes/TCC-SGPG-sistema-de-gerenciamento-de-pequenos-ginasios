import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputText from "../../../../../../components/InputText";
import { User } from "../../../../../../constants/localstorage";
import DashBoardAside from "../dashboard_aside";

export default function Students() {
  const user = localStorage.getItem(User);
  const { first_name, user_image } = user ? JSON.parse(user) : {};
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const tempUserData = [
      { id: 1, first_name: "Bruno", last_name: "dos Anjos", email: "o6wI1@example.com", cpf: "72625362887" },
      { id: 2, first_name: "Fernanda", last_name: "Silva", email: "fsilva@example.com", cpf: "98765432100" },
      { id: 3, first_name: "Lucas", last_name: "Martins", email: "lucasm@example.com", cpf: "11223344556" },
      { id: 4, first_name: "Aline", last_name: "Costa", email: "aline.costa@example.com", cpf: "44556677889" },
      { id: 5, first_name: "Carlos", last_name: "Souza", email: "carlos.souza@example.com", cpf: "99887766554" },
    ];

    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setStudents(tempUserData);
        return;
      }

      const filtered = tempUserData.filter((user) =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setStudents(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleClick = (id) => {
    navigate(`/students/${id}`);
  };

  return (
    <div className="flex flex-row flex-1 w-full p-10 gap-4" style={{ background: "var(--primary-blue)" }}>
      <div className="w-[20%] flex flex-col justify-center items-center">
        <DashBoardAside name={first_name} pic={user_image} />
      </div>

      <main className="bg-white flex flex-1 flex-col rounded-2xl shadow-md p-8">
        <div className="mb-4">
          <InputText
            label="Digite o nome do Aluno"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                      index % 2 === 0 ? "bg-blue-700 text-white" : "bg-white text-blue-700"
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
      </main>
    </div>
  );
}

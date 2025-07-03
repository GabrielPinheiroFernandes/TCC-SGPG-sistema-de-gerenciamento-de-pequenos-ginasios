import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, User_token } from "../../../../../../constants/localstorage";
import DashBoardAside from "../dashboard_aside";
import InputText from "../../../../../../components/InputText";
import axios from "axios";
import urls from "../../../../../../constants/urls";
import { Trash2 } from "lucide-react";

export default function Student() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem(User_token);
  const user = localStorage.getItem(User);
  const { first_name, user_image } = user ? JSON.parse(user) : {};

  const [student, setStudent] = useState(null);
  const [originalStudent, setOriginalStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [originalEnrollments, setOriginalEnrollments] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  const api = axios.create({
    baseURL: urls.UrlApi,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const userRes = await api.get(`/user/${id}`);
        const installmentsRes = await api.get(`/installments/${id}`);

        // Converter is_admin para "S" ou "N" para uso interno no front
        const isAdminRaw = userRes.data.data.is_admin;
        const isAdmin = isAdminRaw === true || isAdminRaw === "S" ? "S" : "N";

        const loadedStudent = {
          ...userRes.data.data,
          is_admin: isAdmin,
        };

        setStudent(loadedStudent);
        setOriginalStudent(loadedStudent);

        const parcelsWithUserId = (installmentsRes.data.data || []).map((p) => ({
          ...p,
          user_id: p.user_id || Number(id),
        }));

        setEnrollments(parcelsWithUserId);
        setOriginalEnrollments(parcelsWithUserId);
      } catch (err) {
        console.error("Erro ao buscar dados do aluno:", err);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const studentChanged = JSON.stringify(student) !== JSON.stringify(originalStudent);
    const isSameArray = (a, b) => {
      if (a.length !== b.length) return false;
      return a.every((item, index) => JSON.stringify(item) === JSON.stringify(b[index]));
    };
    const enrollmentChanged = !isSameArray(enrollments, originalEnrollments);
    setHasChanges(studentChanged || enrollmentChanged);
  }, [student, enrollments]);

  function updateEnrollment(index, updatedEnrollment) {
    const withUserId = { ...updatedEnrollment, user_id: Number(id) };
    setEnrollments((prev) => prev.map((item, i) => (i === index ? withUserId : item)));
  }

  function deleteEnrollment(index) {
    const item = enrollments[index];
    if (item.id) {
      api.delete(`/installments/del/${item.id}`)
        .then(() => {
          const updated = [...enrollments];
          updated.splice(index, 1);
          setEnrollments(updated);
        })
        .catch((err) => console.error("Erro ao excluir parcela:", err));
    } else {
      setEnrollments((prev) => prev.filter((_, i) => i !== index));
    }
  }

  function handleStudentChange(field, value) {
    setStudent((prev) => ({ ...prev, [field]: value }));
  }

  function toISODateWithTime(dateString) {
    if (!dateString) return null;
    if (dateString.includes("T")) return dateString;
    return new Date(dateString + "T00:00:00Z").toISOString();
  }

  async function handleDelete() {
    if (!window.confirm("Tem certeza que deseja excluir o aluno?")) return;

    try {
      await api.delete(`/user/del/${id}`);
      if (enrollments.length > 0) {
        await Promise.all(enrollments.map((e) => api.delete(`/installments/del/${e.id}`)));
      }
      navigate("/students");
    } catch (error) {
      console.error("Erro ao excluir usuário ou parcelas:", error);
      alert("Erro ao excluir usuário ou parcelas. Verifique o console.");
    }
  }

  async function handleSave() {
    try {
      const studentChanged = JSON.stringify(student) !== JSON.stringify(originalStudent);

      const enrollmentsWithUserId = enrollments.map((e) => ({
        ...e,
        user_id: Number(id),
        payment_date: toISODateWithTime(e.payment_date),
        expiration_date: toISODateWithTime(e.expiration_date),
      }));

      const updatedInstallments = enrollmentsWithUserId.filter((e) => {
        const original = originalEnrollments.find((orig) => orig.id === e.id);
        return original && JSON.stringify(e) !== JSON.stringify(original);
      });

      const newInstallments = enrollmentsWithUserId.filter((e) => !e.id || e.id === 0);

      if (studentChanged) {
        // Converte is_admin "S"/"N" para booleano para enviar ao backend
        const payload = {
          ...student,
          is_admin: student.is_admin === "S" ? true : false,
        };
        await api.put(`/user/${id}`, payload);
      }

      for (const inst of updatedInstallments) {
        await api.put(`/installments/${inst.id}`, inst);
      }

      for (const inst of newInstallments) {
        const { id: _ignore, ...payload } = inst;
        await api.post(`/installments/add`, payload);
      }

      setOriginalStudent(student);
      setOriginalEnrollments(enrollments);
      setHasChanges(false);
      alert("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar alterações. Veja o console.");
    }
  }

  function addNewInstallment() {
    const expiration = new Date();
    expiration.setMonth(expiration.getMonth() + 1);

    const newInstallment = {
      id: 0,
      user_id: Number(id),
      payment: 50,
      payment_date: null,
      expiration_date: expiration.toISOString().split("T")[0],
      payment_status: false,
    };

    setEnrollments((prev) => [...prev, newInstallment]);
  }

  return (
    <div className="flex flex-row w-full h-screen p-10 gap-4" style={{ background: "var(--primary-blue)" }}>
      <div className="w-[20%] flex flex-col justify-start items-center h-full">
        <DashBoardAside name={first_name} pic={user_image} />
      </div>

      <main className="flex flex-1 flex-col gap-6 min-h-0 w-full h-full">
        <section className="bg-white rounded-2xl p-6 shadow-md max-h-[350px] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-center font-bold text-lg text-blue-700">DADOS DO USUÁRIO</h2>
            <button className="text-red-500 text-sm underline" onClick={handleDelete}>Excluir Aluno</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputText label="Primeiro Nome" value={student?.first_name || ""} onChange={(e) => handleStudentChange("first_name", e.target.value)} />
            <InputText label="Segundo Nome" value={student?.last_name || ""} onChange={(e) => handleStudentChange("last_name", e.target.value)} />
            <InputText label="Email" value={student?.email || ""} onChange={(e) => handleStudentChange("email", e.target.value)} />
            <InputText label="Senha" value={student?.pass || "********"} onChange={(e) => handleStudentChange("pass", e.target.value)} />
            <InputText label="Data de Nascimento" type="date" value={student?.birth_date?.split("T")[0] || ""} onChange={(e) => handleStudentChange("birth_date", e.target.value)} />
            <InputText label="Peso" value={student?.weight || ""} onChange={(e) => handleStudentChange("weight", parseFloat(e.target.value))} />
            <InputText label="Altura" value={student?.height || ""} onChange={(e) => handleStudentChange("height", e.target.value)} />

            {/* Radio buttons para Sexo */}
            <div className="flex flex-col justify-center">
              <label className="font-semibold mb-1">Sexo</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sex"
                    value="M"
                    checked={student?.sex === "M"}
                    onChange={() => handleStudentChange("sex", "M")}
                  />
                  Masculino
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sex"
                    value="F"
                    checked={student?.sex === "F"}
                    onChange={() => handleStudentChange("sex", "F")}
                  />
                  Feminino
                </label>
              </div>
            </div>

            {/* Input para CPF */}
            <InputText
              label="CPF"
              value={student?.cpf || ""}
              onChange={(e) => handleStudentChange("cpf", e.target.value)}
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-md flex-1 min-h-0 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-center font-bold text-lg text-blue-700">MATRÍCULAS</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={addNewInstallment}>Nova Parcela</button>
          </div>

          <div className="flex flex-col gap-4 min-h-0">
            {enrollments.length === 0 ? (
              <div className="text-center text-gray-500 text-sm">Nenhuma parcela encontrada para este aluno.</div>
            ) : (
              enrollments.map((mat, index) => (
                <EnrollmentItem key={index} enrollment={mat} onChange={(updated) => updateEnrollment(index, updated)} onDelete={() => deleteEnrollment(index)} />
              ))
            )}
          </div>
        </section>

        {hasChanges && (
          <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg p-4 flex gap-4 z-50">
            <button
              onClick={() => {
                setStudent(originalStudent);
                setEnrollments(originalEnrollments);
              }}
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
            >
              Cancelar
            </button>
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Salvar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function EnrollmentItem({ enrollment, onChange, onDelete }) {
  const { id, payment, payment_date, expiration_date, payment_status } = enrollment;

  function toggleStatus() {
    if (payment_status) {
      onChange({ ...enrollment, payment_status: false, payment_date: null });
    } else {
      const today = new Date().toISOString().split("T")[0];
      onChange({ ...enrollment, payment_status: true, payment_date: today });
    }
  }

  function getMonthName(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", { month: "long" });
  }

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 rounded-lg w-full ${
        payment_status ? "bg-green-400 text-white" : "bg-red-400 text-white"
      }`}
    >
      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold">Parcela de {getMonthName(expiration_date)}</div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={payment_status} onChange={toggleStatus} className="w-5 h-5 cursor-pointer" />
            Pago
          </label>
          <div>ID: {id || "Nova"}</div>
        </div>
      </div>

      <label className="flex flex-col text-sm sm:text-base">
        Valor:
        <input
          type="number"
          step="0.01"
          min="0"
          value={payment}
          onChange={(e) => onChange({ ...enrollment, payment: parseFloat(e.target.value) || 0 })}
          className="rounded px-2 py-1 text-black max-w-[100px]"
        />
      </label>

      <label className="flex flex-col text-sm sm:text-base">
        Pagamento:
        <input
          type="date"
          value={payment_date ? payment_date.split("T")[0] : ""}
          disabled={!payment_status}
          onChange={(e) => onChange({ ...enrollment, payment_date: e.target.value })}
          className={`rounded px-2 py-1 text-black ${!payment_status ? "bg-gray-300" : ""}`}
        />
      </label>

      <label className="flex flex-col text-sm sm:text-base">
        Vencimento:
        <input
          type="date"
          value={expiration_date ? expiration_date.split("T")[0] : ""}
          onChange={(e) => onChange({ ...enrollment, expiration_date: e.target.value })}
          className="rounded px-2 py-1 text-black"
        />
      </label>

      <button onClick={onDelete} className="text-white hover:text-black">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

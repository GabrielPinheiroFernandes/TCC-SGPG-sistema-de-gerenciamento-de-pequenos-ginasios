import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../../../../../../constants/localstorage";
import DashBoardAside from "../dashboard_aside";
import InputText from "../../../../../../components/InputText";

export default function Student() {
  const { id } = useParams();

  const user = localStorage.getItem(User);
  const { first_name, user_image } = user ? JSON.parse(user) : {};

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    // Simulação da requisição com estrutura real
    const studentData = {
      first_name: "Jhon",
      last_name: "Doe",
      email: "email.example@hotmail.com",
      birth: "2000-04-10",
      weight: "70 KG",
      height: "1.80",
      gender: "Masculino",
      password: "********",
    };

    const enrollmentData = Array(150)
      .fill(0)
      .map((_, i) => ({
        id: i + 1,
        user_id: 10,
        payment: 50,
        payment_date: i === 2 ? null : "2026-04-10",
        expiration_date: "2026-04-30",
        payment_status: i === 2 ? false : true,
        created_at: "2025-06-01T12:00:00Z",
        updated_at: "2025-06-10T15:00:00Z",
      }));

    setStudent(studentData);
    setEnrollments(enrollmentData);
  }, [id]);

  function updateEnrollment(index, updatedEnrollment) {
    setEnrollments((oldEnrollments) =>
      oldEnrollments.map((enrollment, i) =>
        i === index ? updatedEnrollment : enrollment
      )
    );
  }

  return (
    <div
      className="flex flex-row w-full h-screen p-10 gap-4"
      style={{ background: "var(--primary-blue)" }}
    >
      {/* Aside */}
      <div className="w-[20%] flex flex-col justify-start items-center h-full">
        <DashBoardAside name={first_name} pic={user_image} />
      </div>

      {/* Conteúdo principal */}
      <main className="flex flex-1 flex-col gap-6 min-h-0 w-full h-full">
        {/* Dados do usuário */}
        <section className="bg-white rounded-2xl p-6 shadow-md max-h-[350px] overflow-y-auto">
          <h2 className="text-center font-bold text-lg text-blue-700 mb-6">
            DADOS DO USUÁRIO
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <InputText label="PRIMEIRO NOME" value={student?.first_name} />
            <InputText label="SEGUNDO NOME" value={student?.last_name} />
            <InputText label="EMAIL" value={student?.email} />
            <InputText label="SENHA" value={student?.password} />
            <InputText label="DATA DE NASCIMENTO" value={student?.birth} />
            <InputText label="PESO" value={student?.weight} />
            <InputText label="ALTURA" value={student?.height} />
            <InputText label="SEXO" value={student?.gender} />
          </div>
        </section>

        {/* Matrículas */}
        <section
          className="bg-white rounded-2xl p-6 shadow-md flex-1 min-h-0 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <h2 className="text-center font-bold text-lg text-blue-700 mb-6">
            MATRÍCULAS
          </h2>
          <div className="flex flex-col gap-4 min-h-0">
            {enrollments.map((mat, index) => (
              <EnrollmentItem
                key={mat.id}
                enrollment={mat}
                onChange={(updated) => updateEnrollment(index, updated)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function EnrollmentItem({ enrollment, onChange }) {
  const {
    id,
    user_id,
    payment,
    payment_date,
    expiration_date,
    payment_status,
  } = enrollment;

  function toggleStatus() {
    if (payment_status) {
      onChange({ ...enrollment, payment_status: false, payment_date: null });
    } else {
      const today = new Date().toISOString().slice(0, 10);
      onChange({ ...enrollment, payment_status: true, payment_date: today });
    }
  }

  function handlePaymentChange(e) {
    const value = e.target.value;
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange({ ...enrollment, payment: numValue });
    } else if (value === "") {
      onChange({ ...enrollment, payment: 0 });
    }
  }

  function handlePaymentDateChange(e) {
    onChange({ ...enrollment, payment_date: e.target.value });
  }

  function handleExpirationDateChange(e) {
    onChange({ ...enrollment, expiration_date: e.target.value });
  }

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 rounded-lg w-full ${
        payment_status ? "bg-green-400 text-white" : "bg-red-400 text-white"
      }`}
    >
      <div className="flex items-center mr-6 mb-2 sm:mb-0">
        <input
          type="checkbox"
          checked={payment_status}
          onChange={toggleStatus}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mr-6 mb-2 sm:mb-0">
        <div>
          <label className="font-semibold">ID: {id}</label>
        </div>
        <div>
          <label className="font-semibold">Usuário ID: {user_id}</label>
        </div>
      </div>

      <label className="flex flex-col text-sm sm:text-base mr-6">
        Valor do Pagamento:
        <div className="flex items-center">
          <span className="mr-1 font-semibold">R$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={payment}
            onChange={handlePaymentChange}
            className="rounded px-2 py-1 text-black max-w-[120px]"
          />
        </div>
      </label>

      <label className="flex flex-col text-sm sm:text-base mr-6">
        Data de Pagamento:
        <input
          type="date"
          value={payment_date || ""}
          onChange={handlePaymentDateChange}
          disabled={!payment_status}
          className={`rounded px-2 py-1 text-black ${
            !payment_status ? "bg-gray-300 cursor-not-allowed" : ""
          }`}
        />
      </label>

      <label className="flex flex-col text-sm sm:text-base">
        Data de Expiração:
        <input
          type="date"
          value={expiration_date}
          onChange={handleExpirationDateChange}
          className="rounded px-2 py-1 text-black"
        />
      </label>
    </div>
  );
}

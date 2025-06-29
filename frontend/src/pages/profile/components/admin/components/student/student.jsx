import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, User_token } from "../../../../../../constants/localstorage";
import DashBoardAside from "../dashboard_aside";
import InputText from "../../../../../../components/InputText";
import axios from "axios";
import urls from "../../../../../../constants/urls";

export default function Student() {
  const { id } = useParams();
  const token = localStorage.getItem(User_token);
  const user = localStorage.getItem(User);
  const { first_name, user_image } = user ? JSON.parse(user) : {};

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  const api = axios.create({
    baseURL: urls.UrlApi,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!id) return ;

    const fetchData = async () => {
      try {
        const userRes = await api.get(`/user/${id}`);
        const installmentsRes = await api.get(`/installments/${id}`);

        setStudent(userRes.data.data);
        setEnrollments(installmentsRes.data.data || []);
      } catch (err) {
        console.error("Erro ao buscar dados do aluno:", err);
      }
    };

    fetchData();
  }, [id]);

  function updateEnrollment(index, updatedEnrollment) {
    setEnrollments((prev) =>
      prev.map((item, i) => (i === index ? updatedEnrollment : item))
    );
  }

  return (
    <div
      className="flex flex-row w-full h-screen p-10 gap-4"
      style={{ background: "var(--primary-blue)" }}
    >
      <div className="w-[20%] flex flex-col justify-start items-center h-full">
        <DashBoardAside name={first_name} pic={user_image} />
      </div>

      <main className="flex flex-1 flex-col gap-6 min-h-0 w-full h-full">
        <section className="bg-white rounded-2xl p-6 shadow-md max-h-[350px] overflow-y-auto">
          <h2 className="text-center font-bold text-lg text-blue-700 mb-6">
            DADOS DO USUÁRIO
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <InputText label="PRIMEIRO NOME" value={student?.first_name} />
            <InputText label="SEGUNDO NOME" value={student?.last_name} />
            <InputText label="EMAIL" value={student?.email} />
            <InputText label="SENHA" value="********" />
            <InputText
              label="DATA DE NASCIMENTO"
              value={student?.birth_date?.split("T")[0]}
            />
            <InputText label="PESO" value={student?.weight} />
            <InputText label="ALTURA" value={student?.height} />
            <InputText label="SEXO" value={student?.sex} />
          </div>
        </section>

        <section
          className="bg-white rounded-2xl p-6 shadow-md flex-1 min-h-0 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <h2 className="text-center font-bold text-lg text-blue-700 mb-6">
            MATRÍCULAS
          </h2>
          <div className="flex flex-col gap-4 min-h-0">
            {enrollments.length === 0 ? (
              <div className="text-center text-gray-500 text-sm">
                Nenhuma parcela encontrada para este aluno.
              </div>
            ) : (
              enrollments.map((mat, index) => (
                <EnrollmentItem
                  key={mat.id}
                  enrollment={mat}
                  onChange={(updated) => updateEnrollment(index, updated)}
                />
              ))
            )}
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
      const today = new Date().toISOString().split("T")[0];
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

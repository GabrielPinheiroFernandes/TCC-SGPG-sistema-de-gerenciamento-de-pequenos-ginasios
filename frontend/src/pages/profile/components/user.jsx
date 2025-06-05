import { User } from "../../../constants/localstorage";
import Pic from "./image";

export default function UserProfile() {
  const user = localStorage.getItem(User);
  const userdata = JSON.parse(user);

  return (
    <div className="flex h-screen w-screen border border-amber-700">
      {/* Lado esquerdo: foto + textos */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-lg h-lg mb-6">
          <Pic src={userdata.user_image} />
        </div>
        <h1
          className="text-xl font-semibold"
          style={{
            fontFamily: "'Koulen', sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
          }}
        >
          {userdata.first_name} {userdata.last_name}
        </h1>
        <h2 className="text-lg text-gray-600">
          {userdata.is_admin ? "Administrador" : "Aluno"}
        </h2>
      </div>

      {/* Lado direito: espaço para seus campos de texto */}
      <div className="flex-1 border border-blue-600 p-6">
        {/* Aqui você coloca os campos de texto depois */}
      </div>
    </div>
  );
}

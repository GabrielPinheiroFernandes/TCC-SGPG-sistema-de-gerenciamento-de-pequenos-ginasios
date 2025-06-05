import { useEffect, useState } from "react";
import { GetUser } from "../api/endpoints/auth";
import parseToken from "../auth/validate_token";
import { User, User_token } from "../constants/localstorage";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const token = localStorage.getItem(User_token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const parsed = parseToken(token);
          const { data, message } = await GetUser(parsed.id, token);
          localStorage.setItem(User, JSON.stringify(data));
          setUserName(data.first_name + " " + data.last_name);
          setUserImage(data.user_image);
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
        }
      }
    };

    fetchUser();
  }, [token]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full flex justify-between items-center px-6 py-4 bg-black text-white">
      <button
        className="text-2xl font-bold hover:opacity-80"
        onClick={() => navigate("/")}
      >
        STUDIO <span className="text-blue-800">FOCUS</span>
      </button>
      <nav className="hidden md:flex space-x-6">
        <a href="#" className="hover:text-blue-400">
          Treinos
        </a>
        <a href="#" className="hover:text-blue-400">
          Suplementação
        </a>
        <a href="#" className="hover:text-blue-400">
          Aulas
        </a>
      </nav>
      {userName ? (
        <button
          type="button"
          onClick={() => {
            navigate("/profile");
          }} // Troque pelo seu handler
          className="flex items-center space-x-2 hover:opacity-80"
        >
          <span
            className="font-semibold"
            style={{ fontFamily: "'Koulen', cursive" }}
          >
            {userName}
          </span>
          {userImage && (
            <img
              src={`${userImage}`}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          )}
        </button>
      ) : (
        <button
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/login")}
        >
          Fazer Login
        </button>
      )}
    </header>
  );
}

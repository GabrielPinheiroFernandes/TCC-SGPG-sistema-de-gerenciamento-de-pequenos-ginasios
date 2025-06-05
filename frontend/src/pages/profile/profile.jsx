import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { User } from "../../constants/localstorage";
import AdminProfile from "./components/admin";
import UserProfile from "./components/user";
import Footer from "../../components/Footer";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem(User);
    if (!user) {
      navigate("/");
      return;
    }

    try {
      const parsed = JSON.parse(user);
      setUserData(parsed);
    } catch (error) {
      console.error("Erro ao fazer parse do user:", error);
      navigate("/");
    }
  }, [navigate]);

  if (!userData) return null; // ou um loading...

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {userData.is_admin ? <AdminProfile /> : <UserProfile />}
      <Footer />
    </div>
  );
}

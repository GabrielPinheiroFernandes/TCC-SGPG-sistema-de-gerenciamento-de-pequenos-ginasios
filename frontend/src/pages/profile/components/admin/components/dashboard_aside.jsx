import { Home, User, LayoutDashboard } from "lucide-react";
import Pic from "../../user/components/image"; // ajuste o caminho conforme necessário
import { useNavigate } from "react-router-dom";

export default function DashBoardAside({ name, pic }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Início", href: "/", icon: Home },
    { label: "Alunos", href: "/students", icon: User },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <aside className="flex flex-col flex-1 items-center w-full border-2 border-gray-300 bg-white min-h-screen rounded-2xl shadow-md">
      {/* Topo: Foto + Nome */}
      <div className="flex flex-col items-center justify-center gap-4 p-6 w-full">
        <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300">
          <Pic src={pic} />
        </div>
        <h1
          className="text-3xl text-center text-primary-blue"
          style={{
            fontFamily: "'Koulen', sans-serif",
            fontWeight: 400,
          }}
        >
          {name}
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col items-center justify-start w-full px-6">
        <h2 className="text-lg font-semibold mb-4 text-center w-full">Dashboard Menu</h2>
        <ul className="space-y-2 w-full">
          {menuItems.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <button
                onClick={() => navigate(href)}
                className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 w-full text-center"
                type="button"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

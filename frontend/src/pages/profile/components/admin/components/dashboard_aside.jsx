import Pic from "../../user/components/image";

export default function DashBoardAside({ name, pic }) {
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
      <nav className="flex-1 flex flex-col items-center justify-start md:justify-center w-full px-6">
        <h2 className="text-lg font-semibold mb-4 text-center md:text-left">Dashboard Menu</h2>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-blue-600 hover:text-blue-800 block text-center md:text-left">
              Overview
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:text-blue-800 block text-center md:text-left">
              Settings
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:text-blue-800 block text-center md:text-left">
              Reports
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

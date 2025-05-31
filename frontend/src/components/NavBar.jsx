export default function NavBar() {
  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-black text-white">
      <div className="text-2xl font-bold">
        STUDIO <span className="text-blue-800">FOCUS</span>
      </div>
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
      <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700">
        Login / Cadastro
      </button>
    </header>
  );
}

export default function Card({ label = "Título do Card", onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full max-w-sm h-96 p-8 bg-white rounded-xl shadow-2xl hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-shadow flex flex-col items-center justify-between text-center"
    >
      {/* Quadrado colorido no topo */}
      <div className="w-16 h-16 bg-blue-500 rounded-md mb-4" />

      {/* Conteúdo central */}
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2">{label}</h1>
        <hr className="border-t border-gray-300 w-24 mb-4" />
        <div className="bg-blue-500 text-white px-6 py-2 rounded-lg text-center pointer-events-none">
          Ação
        </div>
      </div>
    </button>
  );
}

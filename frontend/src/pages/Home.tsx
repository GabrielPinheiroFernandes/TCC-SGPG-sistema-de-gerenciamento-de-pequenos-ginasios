import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import images from "../constants/images";
import { User_token } from "../constants/localstorage";

export default function Home() {
  const token = localStorage.getItem(User_token);

  return (
    <div className="w-full min-h-screen bg-white text-black">
      <NavBar />

      {/* Seção 1: Banner Principal */}
      <section
        className="w-full h-[90vh] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${images.banner})` }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 md:px-20">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
            BEM VINDO A <br />
            STUDIO <span className="text-blue-800">FOCUS</span>
          </h1>
          <button className="bg-blue-800 text-white w-max px-6 py-3 rounded hover:bg-blue-700">
            SAIBA MAIS
          </button>
        </div>
      </section>

      {/* Seção 2: Imagem com texto no centro */}
      <section
        className="w-full h-[500px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${images.treino1})` }}
      >
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h2 className="text-white text-4xl font-bold text-center">
            ALCANCE SUA MELHOR VERSÃO
          </h2>
        </div>
      </section>

      {/* Seção 3: Logo com fundo azul e imagem */}
      <section className="flex flex-col md:flex-row w-full h-[400px]">
        <div
          className="md:w-1/2 w-full h-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${images.treino2})` }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={images.logo}
              alt="Logo"
              className="w-40 h-40 object-contain"
            />
          </div>
        </div>
        <div className="md:w-1/2 w-full bg-blue-800 flex items-center justify-center" />
      </section>

      {/* Seção 4: Imagem com formulário */}
      <section className="flex flex-col md:flex-row w-full">
        <div className="md:w-1/2 w-full">
          <img
            src={images.treino3}
            alt="Treino 3"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 w-full flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">
              COMECE A TREINAR <span className="text-blue-800">HOJE MESMO</span>
            </h2>
            <p className="mb-6 text-sm font-bold text-black">
              COM MENSALIDADE A PARTIR DE R$ 50 POR MÊS
            </p>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nome"
                className="p-3 rounded border border-gray-300"
              />
              <input
                type="email"
                placeholder="Email"
                className="p-3 rounded border border-gray-300"
              />
              <input
                type="tel"
                placeholder="Telefone"
                className="p-3 rounded border border-gray-300"
              />
              <button
                onClick={() =>
                  window.open(
                    "https://api.whatsapp.com/send?phone=5514982180923&text=Ol%C3%A1%21%20Gostaria%20de%20saber%20mais%20sobre%20a%20academia.%20Pode%20me%20passar%20mais%20informa%C3%A7%C3%B5es%3F%20%F0%9F%98%8A",
                    "_blank"
                  )
                }
                className="bg-blue-800 text-white py-3 rounded hover:bg-blue-700 font-semibold"
              >
                MATRÍCULE-SE AGORA
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

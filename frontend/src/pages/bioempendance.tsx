import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import images from "../constants/images";

export default function Bioimpedancia() {
  return (
    <div className="w-full min-h-screen bg-black text-white">
      <NavBar />

      {/* Seção: O que é Bioimpedância */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            O que é a <span className="text-blue-400">Bioimpedância</span>?
          </h1>
          <p className="text-gray-200">
            A bioimpedância é um exame simples, rápido e não invasivo que analisa a composição do corpo, fornecendo dados essenciais para avaliação de saúde, performance física e bem-estar.
          </p>
        </div>
        <div className="md:w-1/2">
          <img src={images.banner} alt="Bioimpedância" className="w-full rounded" />
        </div>
      </section>

      {/* Seção: Como Funciona */}
      <section className="flex flex-col md:flex-row items-center justify-between bg-black px-6 md:px-20 py-16 gap-5">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img src={images.treino1} alt="Funcionamento" className="w-full rounded" />
        </div>
        <div className="md:w-1/2 flex flex-col items-center text-center md:items-start md:text-left gap-1">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">Como Funciona?</h2>
          <p className="text-gray-200 max-w-md">
            O exame de bioimpedância utiliza um pequeno sinal elétrico que percorre o corpo e mede a resistência do tecido corporal. A partir disso, é possível calcular a quantidade de gordura, músculo, água corporal e outros parâmetros importantes.
          </p>
        </div>
      </section>

      {/* Seção: Benefícios */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-2xl font-bold text-blue-400 mb-6">Benefícios da Bioimpedância!</h2>
        <ul className="list-decimal pl-6 text-gray-200 space-y-4">
          <li>
            <strong>Avaliação Completa da Composição Corporal:</strong> fornece informações detalhadas sobre gordura, massa muscular, água corporal e metabolismo basal.
          </li>
          <li>
            <strong>Acompanhamento de Resultados:</strong> permite acompanhar o progresso físico ao longo do tempo.
          </li>
          <li>
            <strong>Melhora na Performance e Saúde:</strong> com dados precisos, é possível realizar ajustes mais eficazes em treinos e alimentação.
          </li>
        </ul>
      </section>

      {/* Seção: Como é realizado */}
      <section className="bg-black px-6 md:px-20 py-16">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">
          Como é Realizado o Exame de Bioimpedância?
        </h2>
        <p className="text-gray-200">
          O exame é realizado por meio de um aparelho que emite um sinal elétrico de baixa intensidade, passando pelo corpo. O processo é rápido e indolor, com duração média de 5 a 10 minutos.
        </p>
      </section>

      {/* Seção: Avaliação */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-2xl font-bold text-blue-400 mb-6">O que a Bioimpedância Avalia?</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-2">
          <li><strong>Percentual de Gordura Corporal</strong></li>
          <li><strong>Massa Muscular</strong></li>
          <li><strong>Água Corporal</strong></li>
          <li><strong>Taxa Metabólica Basal</strong></li>
        </ul>
      </section>

      {/* Seção: Quem deve fazer */}
      <section className="px-6 md:px-20 py-16 bg-black">
        <h2 className="text-2xl font-bold text-blue-400 mb-6">Quem Deve Fazer o Exame de Bioimpedância?</h2>
        <p className="text-gray-200 mb-4">
          Pessoas que desejam monitorar sua saúde e composição corporal de forma precisa, incluindo atletas, praticantes de atividade física, pessoas em processo de emagrecimento e pacientes com doenças relacionadas à composição corporal.
        </p>
        <ul className="list-decimal pl-6 text-gray-200 space-y-2">
          <li>É indolor e não invasivo.</li>
          <li>A frequência ideal é a cada 2-3 meses.</li>
          <li>Complementa exames clínicos, mas não substitui.</li>
        </ul>
      </section>

      {/* Seção: Call to Action */}
      <section className="flex justify-center py-12 bg-blue-800">
        <button
          onClick={() => window.open("https://api.whatsapp.com/send?phone=5514982180923&text=Olá! Quero agendar meu exame de bioimpedância.", "_blank")}
          className="bg-white text-blue-800 px-6 py-3 rounded font-semibold hover:bg-gray-200"
        >
          Agende seu horário aqui
        </button>
      </section>

      <Footer />
    </div>
  );
}

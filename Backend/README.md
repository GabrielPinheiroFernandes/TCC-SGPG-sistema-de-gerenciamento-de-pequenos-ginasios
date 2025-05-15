🚀 Iniciando o Backend SGPG com Docker e Make

📦 Pré-requisitos:
- Docker instalado: https://docs.docker.com/get-docker/
- Docker Compose instalado: incluso nas versões recentes do Docker
- Go instalado: https://golang.org/doc/install
- Make instalado:

  ## Linux (Debian/Ubuntu)
  sudo apt update && sudo apt install -y make

  ## macOS (via Homebrew)
  brew install make

  ## Windows
  Instalar via WSL (recomendado) ou use o Make via Git Bash:
  https://www.gnu.org/software/make/

📁 Estrutura esperada:
- Um arquivo `docker-compose.yml` na raiz do backend
- Um `Makefile` com os comandos necessários

🚀 Iniciar a aplicação:
Abra seu terminal na raiz do projeto e rode:

**Iniciar containers com Docker**
```
make start
```

**Rodar a aplicação localmente (fora do Docker, útil para debug)**
```
make run-dev
```

🛠 Comandos úteis:

**Parar os containers**
```
make stop
```

**Ver logs em tempo real**
```
make logs
```

**Rodar testes**
```
make test
```

**Organizar dependências**
```
make tidy
```

**Formatar código**
```
make fmt
```

📌 Obs:
- Certifique-se de que a porta 3306 (MySQL) e 8080 (sua API) estejam livres.
- As variáveis de ambiente estão sendo lidas do `.env` na raiz do projeto.
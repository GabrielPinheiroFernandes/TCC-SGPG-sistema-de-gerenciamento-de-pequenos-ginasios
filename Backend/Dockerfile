# Etapa 1: build da aplicação usando imagem oficial do Go
FROM golang:1.22.2 AS build

# Define o diretório de trabalho no container de build
WORKDIR /app

# Copia arquivos de dependência e resolve módulos
COPY go.mod go.sum ./
RUN go mod tidy

# Copia o restante do código-fonte
COPY . .

# Apenas para depuração, mostra estrutura de arquivos
RUN ls -R /app

# Compila a aplicação (ajuste o caminho conforme sua estrutura)
RUN go build -o api ./cmd/api/

# Etapa 2: imagem final enxuta com Ubuntu
FROM ubuntu:22.04

# Define o diretório de trabalho no container final
WORKDIR /app

# Instala dependências básicas necessárias
RUN apt-get update && apt-get install -y ca-certificates libc6

# Copia o binário compilado da etapa anterior
COPY --from=build /app/api /usr/local/bin/api

# Copia o arquivo .env para dentro do container
COPY --from=build /app/.env .env

# Expõe a porta usada pela aplicação
EXPOSE 8080

# Comando para rodar o binário
CMD ["/usr/local/bin/api"]

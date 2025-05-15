# Makefile para gerenciamento do backend SGPG

# Executa a aplicação Go localmente
run-dev:
	go mod tidy
	# go mod vendor
	go run cmd/api/main.go

# Sobe os containers com Docker Compose
start:
	docker compose up -d

# Sobe o container da api
init-api:
	docker compose build app && docker compose up -d app

# Sobe o container mysql
init-bd:
	docker compose build db && docker compose up -d db
# Para os containers
stop:
	docker compose down

# Reinicia os containers
restart:
	docker compose down && docker compose up -d

# Exibe logs em tempo real
logs:
	docker compose logs -f

# Builda os containers
build:
	docker compose build

# Lista os containers rodando
ps:
	docker compose ps

# Executa migrações (exemplo)
migrate:
	go run cmd/migrate/main.go

# Formata o código
fmt:
	gofmt -w .

# Organiza as dependências
tidy:
	go mod tidy

# Limpa arquivos binários ou temporários
clean:
	rm -rf bin/*

# Executa testes
test:
	go test ./...

# Rebuilda apenas os containers
rebuild:
	docker compose down
	docker compose build app db
	docker compose up -d

# Inicia o Delve para debug remoto
debug:
	dlv debug cmd/api/main.go --headless --listen=:2345 --api-version=2 --accept-multiclient

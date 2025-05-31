.PHONY: backend frontend start backend-dev frontend-dev run-dev

backend:
	cd backend && make rebuild

frontend:
	cd frontend && make start

backend-dev:
	cd backend && make run

frontend-dev:
	cd frontend && make run

start: backend frontend

run-dev:
	make backend-dev
	make frontend-dev
	
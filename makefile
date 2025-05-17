.PHONY: backend frontend start

backend:
	cd backend && make rebuild

frontend:
	cd frontend && make run

start: backend frontend

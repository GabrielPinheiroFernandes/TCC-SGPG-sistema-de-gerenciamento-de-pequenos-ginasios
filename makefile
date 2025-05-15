.PHONY: backend frontend start

backend:
	cd backend && make rebuild

frontend:
	cd frontend && npm install && npm run dev

start: backend frontend

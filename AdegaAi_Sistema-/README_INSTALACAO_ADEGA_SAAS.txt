REQUISITOS:
- Python 3.10+
- PostgreSQL rodando
- Node.js 18+, Bun instalado

PASSO A PASSO BACKEND:
1. cd backend
2. python -m venv venv
3. venv\Scripts\activate (Windows) | source venv/bin/activate (Linux/Mac)
4. pip install -r requirements.txt
5. Edite backend/core/settings.py com seu banco postgres
6. python manage.py makemigrations
7. python manage.py migrate
8. python manage.py createsuperuser
9. python manage.py runserver

PASSO A PASSO FRONTEND:
1. cd frontend
2. bun install
3. bun add recharts
4. bun run dev

PRONTO!
Dúvidas, chame o suporte.

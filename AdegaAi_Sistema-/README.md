# AdegaAi - Sistema de Gestão de Adegas (SaaS Multitenant)

## 📦 Pré-requisitos

- Docker e Docker Compose
- Python 3.10+ (opcional para execução local)

## 🚀 Como executar com Docker

```bash
cd backend
docker-compose up --build
```

Acesse:
- Backend: http://localhost:8000/
- pgAdmin: http://localhost:5050/ (usuário: admin@admin.com, senha: admin)

## ⚙️ Migrations

```bash
docker-compose exec web python manage.py migrate
```

## 👤 Admin Django

```bash
docker-compose exec web python manage.py createsuperuser
```

## 🧪 Execução sem Docker (alternativa)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

---

## 📚 Estrutura

- `usuarios/`: gerenciamento de contas e empresas
- `api/`: produtos, vendas, estoque
- `core/`: configurações principais

---

## ✅ Funcionalidades

- Multitenancy por empresa
- Autenticação JWT
- Gestão de estoque, vendas, relatórios

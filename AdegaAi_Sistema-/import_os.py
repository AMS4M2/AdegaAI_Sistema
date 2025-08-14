import os

def escrever(caminho, conteudo):
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(conteudo.lstrip("\n"))

def criar_backend():
    os.makedirs("backend/core", exist_ok=True)
    os.makedirs("backend/usuarios/migrations", exist_ok=True)
    os.makedirs("backend/api/migrations", exist_ok=True)

    escrever("backend/manage.py", '''
#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
''')

    escrever("backend/requirements.txt", '''
django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
psycopg2-binary
''')

    escrever("backend/core/__init__.py", "")
    escrever("backend/core/asgi.py", '''
import os
from django.core.asgi import get_asgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
application = get_asgi_application()
''')
    escrever("backend/core/settings.py", '''
import os
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-chave-exemplo'
DEBUG = True
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'usuarios',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'adegadb',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'usuarios.Usuario'
CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
}
''')
    escrever("backend/core/urls.py", '''
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('usuarios.urls')),
    path('api/', include('api.urls')),
]
''')
    escrever("backend/core/wsgi.py", '''
import os
from django.core.wsgi import get_wsgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
application = get_wsgi_application()
''')

    # App usuarios
    escrever("backend/usuarios/__init__.py", "")
    escrever("backend/usuarios/admin.py", '''
from django.contrib import admin
from .models import Empresa, Usuario, Licenca

admin.site.register(Empresa)
admin.site.register(Usuario)
admin.site.register(Licenca)
''')
    escrever("backend/usuarios/apps.py", '''
from django.apps import AppConfig

class UsuariosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'usuarios'
''')
    escrever("backend/usuarios/models.py", '''
from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date

class Empresa(models.Model):
    nome = models.CharField(max_length=255)
    cnpj = models.CharField(max_length=18, unique=True)
    ativa = models.BooleanField(default=True)
    def __str__(self): return self.nome

class Licenca(models.Model):
    empresa = models.OneToOneField(Empresa, on_delete=models.CASCADE)
    ativa = models.BooleanField(default=True)
    validade = models.DateField()
    def is_valida(self): return self.ativa and self.validade >= date.today()

class Usuario(AbstractUser):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, null=True, blank=True)
    cargo = models.CharField(max_length=100, default='funcionario')
    def __str__(self): return self.username
''')
    escrever("backend/usuarios/serializers.py", '''
from rest_framework import serializers
from .models import Usuario
from django.contrib.auth import authenticate

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'empresa', 'cargo']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Credenciais inválidas.")
''')
    escrever("backend/usuarios/views.py", '''
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Empresa, Usuario
from django.contrib.auth.hashers import make_password
from .serializers import UsuarioSerializer

class UsuarioLogadoView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

class RegistroView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        data = request.data
        try:
            empresa = Empresa.objects.create(
                nome=data.get("empresa"),
                cnpj=data.get("cnpj", "00.000.000/0000-00")
            )
            usuario = Usuario.objects.create(
                username=data.get("username"),
                email=data.get("email"),
                password=make_password(data.get("password")),
                empresa=empresa
            )
            return Response({"msg": "Usuário e empresa criados com sucesso"})
        except Exception as e:
            return Response({"erro": str(e)}, status=400)
''')
    escrever("backend/usuarios/urls.py", '''
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UsuarioLogadoView, RegistroView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UsuarioLogadoView.as_view(), name='usuario_logado'),
    path('registro/', RegistroView.as_view(), name='registro'),
]
''')
    escrever("backend/usuarios/migrations/__init__.py", "")

    # App api
    escrever("backend/api/__init__.py", "")
    escrever("backend/api/models.py", '''
from django.db import models
from usuarios.models import Empresa

class Produto(models.Model):
    nome = models.CharField(max_length=255)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    estoque = models.PositiveIntegerField()
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome

class Venda(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    data = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)

class ItemVenda(models.Model):
    venda = models.ForeignKey(Venda, related_name='itens', on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)
''')
    escrever("backend/api/serializers.py", '''
from rest_framework import serializers
from .models import Produto, Venda, ItemVenda

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'

class ItemVendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemVenda
        fields = '__all__'

class VendaSerializer(serializers.ModelSerializer):
    itens = ItemVendaSerializer(many=True, read_only=True)
    class Meta:
        model = Venda
        fields = '__all__'
''')
    escrever("backend/api/views.py", '''
from rest_framework import viewsets, permissions
from .models import Produto, Venda, ItemVenda
from .serializers import ProdutoSerializer, VendaSerializer, ItemVendaSerializer

class ProdutoViewSet(viewsets.ModelViewSet):
    serializer_class = ProdutoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Produto.objects.filter(empresa=self.request.user.empresa)

    def perform_create(self, serializer):
        serializer.save(empresa=self.request.user.empresa)

class VendaViewSet(viewsets.ModelViewSet):
    serializer_class = VendaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Venda.objects.filter(empresa=self.request.user.empresa)

    def perform_create(self, serializer):
        serializer.save(empresa=self.request.user.empresa)

class ItemVendaViewSet(viewsets.ModelViewSet):
    serializer_class = ItemVendaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ItemVenda.objects.filter(venda__empresa=self.request.user.empresa)
''')
    escrever("backend/api/urls.py", '''
from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet, VendaViewSet, ItemVendaViewSet

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet)
router.register(r'vendas', VendaViewSet)
router.register(r'itens', ItemVendaViewSet)

urlpatterns = router.urls
''')
    escrever("backend/api/migrations/__init__.py", "")

def criar_frontend():
    os.makedirs("frontend/src/pages", exist_ok=True)
    os.makedirs("frontend/src/components", exist_ok=True)

    escrever("frontend/package.json", '''
{
  "name": "adega-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "bun run dev",
    "build": "bun run build"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.10.0",
    "axios": "^1.6.0"
  }
}
''')
    escrever("frontend/bun.lockb", "")  # Será criado pelo bun install
    escrever("frontend/src/main.jsx", '''
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
''')
    escrever("frontend/src/App.jsx", '''
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import ProdutoNovo from "./pages/ProdutoNovo";
import VendaNova from "./pages/VendaNova";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/produto-novo" element={<PrivateRoute><ProdutoNovo /></PrivateRoute>} />
        <Route path="/venda-nova" element={<PrivateRoute><VendaNova /></PrivateRoute>} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
export default App;
''')
    escrever("frontend/src/components/PrivateRoute.jsx", '''
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
''')

    # (Crie os arquivos LoginPage.jsx, Registro.jsx, Dashboard.jsx, ProdutoNovo.jsx, VendaNova.jsx depois, com o conteúdo que geramos antes!)

def criar_readme():
    escrever("README_INSTALACAO_ADEGA_SAAS.txt", '''
REQUISITOS:
- Python 3.10+
- PostgreSQL rodando
- Node.js 18+, Bun instalado

PASSO A PASSO BACKEND:
1. cd backend
2. python -m venv venv
3. venv\\Scripts\\activate (Windows) | source venv/bin/activate (Linux/Mac)
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
''')

if __name__ == "__main__":
    criar_backend()
    criar_frontend()
    criar_readme()
    print("Projeto ADEGA SAAS criado com sucesso! Veja as pastas backend/, frontend/ e o arquivo de guia README_INSTALACAO_ADEGA_SAAS.txt.")

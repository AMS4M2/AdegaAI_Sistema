
import { Button } from "@/components/ui/button";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Calculator, 
  TrendingUp, 
  BarChart3,
  Settings,
  User,
  LogOut,
  UserPlus
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AppSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppSidebar = ({ sidebarOpen, setSidebarOpen }: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: ShoppingCart, label: "Vendas", path: "/sales" },
    { icon: Package, label: "Estoque", path: "/stock" },
    { icon: Users, label: "Fornecedores", path: "/suppliers" },
    { icon: Calculator, label: "Caixa", path: "/cashier" },
    { icon: TrendingUp, label: "Relatórios", path: "/reports" },
    { icon: UserPlus, label: "Funcionários", path: "/employees" },
    { icon: Settings, label: "Configurações", path: "/settings" }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-blue-800">AdegAÍ</h1>
              <p className="text-xs text-gray-500">Sua Adega</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <button 
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-5 w-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          {sidebarOpen && (
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.username || "Usuário"}</p>
              <p className="text-xs text-gray-500">{user?.cargo || "Funcionário"}</p>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;

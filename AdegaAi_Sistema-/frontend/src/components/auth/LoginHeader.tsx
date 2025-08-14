// frontend/src/components/auth/LoginHeader.tsx

import { CardDescription, CardTitle } from "@/components/ui/card";

interface LoginHeaderProps {
  isLogin: boolean;
}

const LoginHeader = ({ isLogin }: LoginHeaderProps) => {
  return (
    <div className="space-y-4 text-center">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-amber-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">A</span>
        </div>
        <span className="text-2xl font-bold text-green-800">AdegAÍ</span>
      </div>
      <div>
        <CardTitle className="text-2xl text-green-800">
          {isLogin ? "Entrar na sua conta" : "Criar nova conta"}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? "Acesse o painel da sua adega"
            : "Comece a gerenciar sua adega hoje mesmo"}
        </CardDescription>
      </div>
    </div>
  );
};

export default LoginHeader;

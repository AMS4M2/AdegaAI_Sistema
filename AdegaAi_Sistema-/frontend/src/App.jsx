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

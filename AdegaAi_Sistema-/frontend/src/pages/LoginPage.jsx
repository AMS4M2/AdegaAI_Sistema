import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import authService from '@/services/authService';


function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/auth/login/", form);
      localStorage.setItem("accessToken", response.data.access);
      navigate("/dashboard");
    } catch (err) {
      setError("Usuário ou senha inválidos.");
    }
  };

  return (
    <div style={{ maxWidth: 340, margin: "100px auto" }}>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input name="username" placeholder="Usuário" onChange={handleChange} required /><br/>
        <input name="password" type="password" placeholder="Senha" onChange={handleChange} required /><br/>
        <button type="submit">Entrar</button>
        {error && <p style={{color: "red"}}>{error}</p>}
      </form>
    </div>
  );
}
export default LoginPage;
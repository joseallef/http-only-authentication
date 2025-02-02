import { useState } from "react";
import { register } from "./authService";

const RegisterForm = () => {
  const [user, setUser] = useState({
    username: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register(user.username, user.password);
      setMessage(response.message);
      setError("");
    } catch (err: any) {
      setMessage("");
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastro</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        value={user.username}
        onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))}
        placeholder="Usuário"
      />
      <input
        type="password"
        value={user.password}
        onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
        placeholder="Senha"
      />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default RegisterForm;

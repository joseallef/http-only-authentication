import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Simulando um banco de dados em memória (Set para melhor desempenho)
const users = new Set([{ username: "teste", password: "123" }]);

app.get("/", (req, res) => {
  console.log("SECRET_KEY", SECRET_KEY);
  console.log("PORT", PORT);
  res.status(200).json({ message: "OK" });
});

// Middleware de autenticação
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Acesso negado! Token não fornecido." });

  jwt.verify(token, SECRET_KEY, (err, decode) => {
    if (err) return res.status(403).json({ error: "Token inválido!" });

    req.user = decode;
    next();
  });
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = [...users].find((u) => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Credenciais inválidas" });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ message: "Login bem-sucedido!" });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logout realizado com sucesso!" });
});

// Rota para obter usuário logado
app.get("/me", verifyToken, (req, res) => {
  res.json({ username: req.user.username });
});

app.post("/register", verifyToken, (req, res) => {
  const { username, password } = req.body;

  if ([...users].some((u) => u.username === username)) {
    return res.status(400).json({ error: "Usuário já existe!" });
  }

  users.add({ username, password });
  res.json({ message: "Usuário registrado com sucesso!" });
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT} com Bun!`));

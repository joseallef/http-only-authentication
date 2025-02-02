import axios from "axios";

const API_URL = "http://localhost:5000";

// Configura Axios para enviar cookies HTTP-only
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const fetchUser = async () => {
  try {
    const response = await api.get(`/me`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return null; // Se não estiver autenticado, retorna null
    } else {
      console.error("Erro desconhecido:", error);
    }
  }
};

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post(`/login`, { username, password });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Erro ao fazer login");
    } else {
      console.error("Erro desconhecido:", error);
    }
  }
};

export const register = async (username: string, password: string) => {
  try {
    const response = await api.post(`/register`, { username, password });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Erro ao fazer cadastro");
    } else {
      console.error("Erro desconhecido:", error);
    }
  }
};

export const logout = async () => {
  try {
    await api.post(`/logout`);
  } catch (error) {
    console.error("Erro ao fazer logout", error);
  }
};

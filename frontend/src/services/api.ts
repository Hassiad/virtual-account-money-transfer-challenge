import axios from "axios";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

// Add interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post("/auth/signup", data),
};

export const transactionService = {
  getTransactions: () => api.get("/transactions"),
  searchTransactions: (term: string) =>
    api.get(`/transactions/search?term=${term}`),
  transfer: (recipientEmail: string, amount: number) =>
    api.post("/transactions/transfer", { recipientEmail, amount }),
};

export default api;

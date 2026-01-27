// src/services/api.ts
import axios from "axios";
import backendUrl from "@/app/config";

const api = axios.create({ baseURL: backendUrl });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
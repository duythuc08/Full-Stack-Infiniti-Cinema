"use client";
/**
 * Client-side axios instance (chỉ dùng trong Client Components).
 * Tự động đính kèm JWT token từ localStorage vào mọi request.
 */
import axios from "axios";

const api = axios.create({
  baseURL: "/api-proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

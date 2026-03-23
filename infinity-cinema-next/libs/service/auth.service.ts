import type { LoginResult, RegisterPayload } from "@/types/auth.types";

const BASE_URL = "/api-proxy";

export async function loginUser(username: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 400) {
      throw Object.assign(new Error("Sai tên đăng nhập hoặc mật khẩu!"), { status: res.status });
    }
    throw new Error(`Server trả lỗi ${res.status}`);
  }

  const data = await res.json();
  return data.result as LoginResult;
}

export async function registerUser(payload: RegisterPayload): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    const err = Object.assign(new Error(data.message || "Đăng ký thất bại"), { code: data.code as number });
    throw err;
  }
}

export async function resendOTP(email: string): Promise<void> {
  await fetch(`${BASE_URL}/auth/resendOTP?email=${email}`, { method: "POST" });
}

export async function verifyOTP(email: string, otp: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/verify?otp=${otp}&email=${email}`, { method: "POST" });
  if (!res.ok) throw new Error(`Lỗi: ${res.status}`);
}

export async function sendForgotPassword(username: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error(`Lỗi: ${res.status}`);
}

export async function resetPassword(email: string, newPassword: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/reset-password?email=${email}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword }),
  });
  if (!res.ok) throw new Error(`Lỗi: ${res.status}`);
}

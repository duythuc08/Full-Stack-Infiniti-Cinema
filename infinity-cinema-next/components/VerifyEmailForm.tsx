"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VerifyEmailFormProps {
  email: string;
  onClose: () => void;
}

export function VerifyEmailForm({ email, onClose }: VerifyEmailFormProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api-proxy/auth/verify?otp=${code}&email=${email}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Lỗi: ${response.status}`);

      setMessage("Xác thực thành công! Đang chuyển về đăng nhập...");
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error("Verify email error:", error);
      setMessage("Mã xác thực không hợp lệ hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      const response = await fetch(
        `/api-proxy/auth/resendOTP?email=${email}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Lỗi: ${response.status}`);

      setMessage("OTP mới đã được gửi đến email của bạn.");
      setResendCooldown(30);
    } catch (error) {
      console.error("Resend OTP error:", error);
      setMessage("Không thể gửi lại OTP. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm">
      <div className="absolute inset-0">
        <img
          src="/backgroundLogin.jpg"
          alt="Cinema background"
          className="absolute inset-0 w-full h-full object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      <div className="relative w-full max-w-md p-6 sm:p-8 bg-black/50 border border-white/30 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Film className="w-10 h-10 text-primary" />
          <span className="text-3xl tracking-wider">INFINITY CINEMA</span>
        </Link>

        <h2 className="text-center text-2xl font-medium mb-6">Xác Thực Email</h2>
        <p className="text-sm text-center mb-4 text-muted-foreground">
          Vui lòng nhập mã OTP đã gửi đến{" "}
          <span className="text-white font-medium">{email}</span>
        </p>

        {message && (
          <div className="mb-4 p-3 text-sm text-primary bg-red-100/10 border border-red-500/30 rounded text-center">
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Mã xác thực</Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="Nhập mã OTP..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="bg-zinc-900 text-white border-zinc-700 focus:border-white focus:ring-2 focus:ring-white"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full h-10 mt-4 text-lg font-semibold border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white transition-colors duration-300"
          >
            {loading ? "Đang xác thực..." : "Xác thực"}
          </Button>

          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-white/60">Bạn không nhận được mã?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className={`text-sm ${
                resendCooldown > 0 ? "text-gray-500 cursor-not-allowed" : "text-primary cursor-pointer"
              }`}
            >
              {resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : "Gửi lại mã OTP"}
            </button>
          </div>

          <Button
            type="button"
            onClick={onClose}
            className="w-full h-10 mt-4 text-lg font-semibold bg-black/50 hover:bg-black transition"
          >
            Quay lại đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
}

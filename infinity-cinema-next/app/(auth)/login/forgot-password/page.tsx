"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Film } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendForgotPassword, verifyOTP, resetPassword } from "@/libs/service/auth.service";
import type { ResetPasswordForm, ForgotPasswordStep } from "@/types/auth.types";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState<ResetPasswordForm>({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
    setMessage("");
  };

  // STEP 1: Gửi email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);
    try {
      await sendForgotPassword(email);
      setIsSuccess(true);
      setMessage("OTP đã được gửi. Vui lòng kiểm tra email!");
      setStep("verify");
    } catch (error) {
      console.error(error);
      setMessage("Không thể gửi yêu cầu. Vui lòng kiểm tra email và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Xác thực OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);
    try {
      await verifyOTP(email, otp);
      setIsSuccess(true);
      setMessage("OTP xác thực thành công. Vui lòng nhập mật khẩu mới.");
      setStep("reset");
    } catch (error) {
      console.error(error);
      setMessage("OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;
    if (!passwordRegex.test(form.newPassword)) {
      toast.error("Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ in hoa và 1 ký tự đặc biệt!");
      return;
    }

    setLoading(true);
    setMessage("");
    setIsSuccess(false);
    try {
      await resetPassword(email, form.newPassword);
      setIsSuccess(true);
      setMessage("Mật khẩu đã được cập nhật thành công!");
      toast.success("Đặt lại mật khẩu thành công! Đang chuyển hướng...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      console.error(error);
      setMessage("Không thể cập nhật mật khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="absolute inset-3">
          <img src="/backgroundLogin.jpg" alt="Cinema background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        </div>

        <div className="relative w-full max-w-md p-6 sm:p-8 bg-black/50 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <Film className="w-10 h-10 text-primary" />
            <span className="text-3xl tracking-wider text-white">INFINITY CINEMA</span>
          </Link>

          <h2 className="text-center text-2xl font-medium mb-6 text-white">
            {step === "email" && "Quên mật khẩu"}
            {step === "verify" && "Xác thực OTP"}
            {step === "reset" && "Đặt mật khẩu mới"}
          </h2>

          {message && (
            <div className={`mb-4 p-3 text-sm border rounded text-center ${
              isSuccess
                ? "text-green-400 bg-green-100/10 border-green-500/30"
                : "text-primary bg-red-100/10 border-red-500/30"
            }`}>
              <span>{message}</span>
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleSendEmail} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-900 text-white border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button type="submit" size="lg" disabled={loading} className="w-full h-10 mt-4 text-lg font-semibold bg-primary hover:bg-primary/90 cursor-pointer">
                {loading ? "Đang gửi..." : "Gửi OTP"}
              </Button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-white">Mã OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Nhập mã OTP từ email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="bg-zinc-900 text-white border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button type="submit" size="lg" disabled={loading} className="w-full h-10 mt-4 text-lg font-semibold bg-primary hover:bg-primary/90">
                {loading ? "Đang xác thực..." : "Xác thực OTP"}
              </Button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-white">Mật khẩu mới</Label>
                <Input id="newPassword" name="newPassword" type="password" placeholder="Nhập mật khẩu mới" value={form.newPassword} onChange={handleChange} required className="bg-zinc-900 text-white border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Xác nhận mật khẩu</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={handleChange} required className="bg-zinc-900 text-white border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              <Button type="submit" size="lg" disabled={loading} className="w-full h-10 mt-4 text-lg font-semibold bg-primary hover:bg-primary/90">
                {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </Button>
            </form>
          )}

          <Button type="button" onClick={() => router.push("/login")} variant="ghost" className="w-full h-10 mt-4 text-white hover:bg-white/10 cursor-pointer">
            Quay lại đăng nhập
          </Button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 border-4 border-primary border-solid border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-lg font-medium">Đang xử lý...</span>
          </div>
        </div>
      )}
    </>
  );
}

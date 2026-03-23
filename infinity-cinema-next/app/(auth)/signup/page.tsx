"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VerifyEmailForm } from "@/components/VerifyEmailForm";
import { registerUser } from "@/libs/service/auth.service";
import type { SignupFormState } from "@/types/auth.types";

type CompletedFields = Partial<Record<keyof SignupFormState, boolean>>;

export default function SignUpPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "verify">("signup");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [completedFields, setCompletedFields] = useState<CompletedFields>({});
  const [form, setForm] = useState<SignupFormState>({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    birthday: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompletedFields((prev) => ({ ...prev, [name]: value.trim() !== "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;
    if (!passwordRegex.test(form.password)) {
      setError("Mật khẩu phải có chữ thường, chữ hoa và ký tự đặc biệt!");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        username: form.email,
        password: form.password,
        firstname: form.firstname,
        lastname: form.lastname,
        phoneNumber: form.phoneNumber,
        birthday: form.birthday,
      });
      setMode("verify");
    } catch (err) {
      const castErr = err as Error & { code?: number };
      if (castErr.code === 1001) {
        setError("Email đã tồn tại. Vui lòng đăng nhập.");
      } else {
        setError(castErr.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name: keyof SignupFormState) =>
    `transition-all duration-300 ${
      completedFields[name]
        ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]"
        : "bg-white/5 text-white border-white/20"
    } focus:border-primary focus:ring-2 focus:ring-primary/60`;

  if (mode === "verify") {
    return <VerifyEmailForm email={form.email} onClose={() => router.push("/login")} />;
  }

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
        <div className="absolute inset-0">
          <img src="/backgroundLogin.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-black/75" />
        </div>

        <div className="relative z-10 w-full px-4">
          <div className="mx-auto max-w-md bg-black/55 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] px-6 py-8 sm:px-10 sm:py-10">
            <Link href="/" className="flex justify-center gap-2 mb-2">
              <Film className="w-9 h-9 text-primary" />
              <span className="text-2xl tracking-widest font-semibold">INFINITY CINEMA</span>
            </Link>

            <h1 className="text-center text-2xl font-semibold tracking-wide mb-10">Đăng Ký</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-white mb-1">Họ</Label>
                  <Input name="firstname" value={form.firstname} onChange={handleChange} onBlur={handleBlur} required placeholder="Nguyễn" className={inputClass("firstname")} />
                </div>
                <div>
                  <Label className="text-sm text-white mb-1">Tên</Label>
                  <Input name="lastname" value={form.lastname} onChange={handleChange} onBlur={handleBlur} required placeholder="Văn A" className={inputClass("lastname")} />
                </div>
              </div>

              <div>
                <Label className="text-sm text-white mb-1">Số điện thoại</Label>
                <Input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} onBlur={handleBlur} required placeholder="0123456789" className={inputClass("phoneNumber")} />
              </div>

              <div>
                <Label className="text-sm text-white mb-1">Ngày sinh</Label>
                <Input type="date" name="birthday" value={form.birthday} onChange={handleChange} onBlur={handleBlur} required className={inputClass("birthday")} />
              </div>

              <div>
                <Label className="text-sm text-white mb-1">Email</Label>
                <Input type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} required placeholder="example@email.com" className={inputClass("email")} />
              </div>

              <div>
                <Label className="text-sm text-white mb-1">Mật khẩu</Label>
                <Input type="password" name="password" value={form.password} onChange={handleChange} onBlur={handleBlur} required placeholder="Ít nhất 6 ký tự" className={inputClass("password")} />
              </div>

              <div>
                <Label className="text-sm text-white mb-1">Xác nhận mật khẩu</Label>
                <Input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur} required placeholder="Nhập lại mật khẩu" className={inputClass("confirmPassword")} />
              </div>

              {error && <p className="text-sm text-red-400 text-center">{error}</p>}

              <Button type="submit" className="w-full h-14 mt-4 text-lg font-semibold bg-primary hover:bg-primary/90 transition cursor-pointer">
                Đăng ký
              </Button>
            </form>

            <p className="mt-6 text-sm text-center text-white/70">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-white/90 font-medium hover:underline">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-white font-medium">Đang đăng ký...</span>
          </div>
        </div>
      )}
    </>
  );
}

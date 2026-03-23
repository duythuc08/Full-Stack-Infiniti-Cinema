"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { VerifyEmailForm } from "@/components/VerifyEmailForm";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  return (
    <VerifyEmailForm
      email={email}
      onClose={() => router.push("/login")}
    />
  );
}

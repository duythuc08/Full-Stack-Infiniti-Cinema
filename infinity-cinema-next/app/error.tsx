"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="w-full max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="flex flex-col items-center gap-6">
        <AlertTriangle className="w-20 h-20 text-yellow-500" />
        <h1 className="text-white text-4xl font-black">Đã xảy ra lỗi!</h1>
        <p className="text-muted-foreground text-lg">
          Rất tiếc, có lỗi xảy ra khi tải trang này. Vui lòng thử lại.
        </p>
        {error.message && (
          <p className="text-red-400/80 text-sm font-mono bg-red-950/20 border border-red-900/30 px-4 py-2 rounded-md">
            {error.message}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button onClick={() => router.push("/")} variant="outline" className="gap-2">
            <Home className="w-4 h-4" /> Về trang chủ
          </Button>
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Thử lại
          </Button>
        </div>
      </div>
    </main>
  );
}

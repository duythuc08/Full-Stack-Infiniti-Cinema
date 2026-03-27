"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Film } from "lucide-react";
import Link from "next/link";

const STEPS = [
  { label: "Chọn ghế", path: "/seat-selection" },
  { label: "Bắp & Nước", path: "/food-selection" },
  { label: "Thanh toán", path: "/payment" },
];

function getStepIndex(pathname: string): number {
  if (pathname.includes("/payment-success") || pathname.includes("/payment-fail")) return 3;
  const idx = STEPS.findIndex((s) => pathname.includes(s.path));
  return idx >= 0 ? idx : 0;
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeStep = getStepIndex(pathname);

  const isSuccessOrFail =
    pathname.includes("/payment-success") || pathname.includes("/payment-fail");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isSuccessOrFail && (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/*
              3-cột cân bằng: left và right cùng chiều rộng cố định
              để phần Steps ở giữa luôn thực sự căn giữa viewport.
            */}
            <div className="flex items-center h-16 sm:h-[68px]">

              {/* Left — chiều rộng cố định bằng right */}
              <div className="w-24 sm:w-44 flex items-center">
                <button
                  onClick={() => router.back()}
                  aria-label="Quay lại"
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                  <span className="hidden sm:inline text-sm font-medium">Quay lại</span>
                </button>
              </div>

              {/* Center — flex-1 thực sự căn giữa vì hai bên cân bằng */}
              <div className="flex-1 flex items-center justify-center gap-0">
                {STEPS.map((step, idx) => (
                  <div key={step.path} className="flex items-center">
                    {/* Step node */}
                    <div className="flex flex-col items-center gap-0.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          idx < activeStep
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/40"
                            : idx === activeStep
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg shadow-primary/30"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {idx < activeStep ? "✓" : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] font-medium whitespace-nowrap transition-colors duration-300 ${
                          idx <= activeStep ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Connector — mb-3.5 nâng lên ngang tâm circle */}
                    {idx < STEPS.length - 1 && (
                      <div className="w-10 sm:w-16 h-0.5 mx-2 mb-3.5 rounded-full overflow-hidden bg-border flex-shrink-0">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: idx < activeStep ? "100%" : "0%" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right — chiều rộng cố định bằng left, nội dung căn phải */}
              <div className="w-24 sm:w-44 flex items-center justify-end">
                <Link
                  href="/"
                  aria-label="Trang chủ Infinity Cinema"
                  className="flex items-center gap-1.5 group"
                >
                  <Film className="w-5 h-5 text-primary transition-transform duration-200 group-hover:scale-110" />
                  <span className="hidden sm:inline text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
                    INFINITY CINEMA
                  </span>
                </Link>
              </div>

            </div>
          </div>
        </header>
      )}

      <main className="flex-grow">{children}</main>
    </div>
  );
}

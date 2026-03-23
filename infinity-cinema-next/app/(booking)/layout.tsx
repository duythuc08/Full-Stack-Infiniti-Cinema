"use client";

import { usePathname } from "next/navigation";

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
  const activeStep = getStepIndex(pathname);

  const isSuccessOrFail =
    pathname.includes("/payment-success") || pathname.includes("/payment-fail");

  return (
    <>
      {!isSuccessOrFail && (
        <div className="sticky top-16 sm:top-20 z-40 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-0">
              {STEPS.map((step, idx) => (
                <div key={step.path} className="flex items-center">
                  {/* Step node */}
                  <div className="flex flex-col items-center gap-1">
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
                      className={`text-[10px] font-medium whitespace-nowrap ${
                        idx <= activeStep ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector */}
                  {idx < STEPS.length - 1 && (
                    <div className="w-16 sm:w-24 h-0.5 mx-2 mb-4 rounded-full overflow-hidden bg-secondary">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: idx < activeStep ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}

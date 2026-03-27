"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";

const BOOKING_PREFIXES = ["/seat-selection/", "/food-selection/", "/payment/", "/payment-success/", "/payment-fail/"];

export function FooterConditional() {
  const pathname = usePathname();
  if (BOOKING_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return <Footer />;
}

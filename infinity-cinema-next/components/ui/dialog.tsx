"use client";

import * as React from "react";
import { createPortal } from "react-dom";

/* ─── Dialog Root ─────────────────────────────────────────── */
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      {/* Content wrapper */}
      <div className="relative z-10 w-full flex items-start justify-center min-h-full py-6">
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ─── DialogContent ───────────────────────────────────────── */
export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DialogContent({ className = "", children, ...props }: DialogContentProps) {
  return (
    <div
      className={`relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden ${className}`}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── DialogHeader ────────────────────────────────────────── */
export function DialogHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-5 border-b border-border ${className}`} {...props}>
      {children}
    </div>
  );
}

/* ─── DialogTitle ─────────────────────────────────────────── */
export function DialogTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={`text-lg font-bold text-foreground leading-tight ${className}`} {...props}>
      {children}
    </h2>
  );
}

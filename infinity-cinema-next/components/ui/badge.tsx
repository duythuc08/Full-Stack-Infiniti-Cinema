import * as React from "react";

// 1. CẬP NHẬT LẠI TYPE: Thêm "pending", "cancelled", "paid" vào đây
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?:
        | "default"
        | "secondary"
        | "outline"
        | "destructive"
        | "pending"
        | "cancelled"
        | "paid";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
    // 2. TỐI ƯU LOGIC: Thay vì dùng if/else hay toán tử 3 ngôi lồng nhau, hãy dùng Object Map
    const variantClasses = {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-input bg-transparent text-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-transparent",
        cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-transparent",
        paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-transparent",
    };

    // Lấy class tương ứng với variant, nếu không truyền gì thì lấy 'default'
    const activeVariantClass = variantClasses[variant] || variantClasses.default;

    return (
        <div
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${activeVariantClass} ${className}`}
            {...props}
        />
    );
}
import Link from "next/link";
import { Film, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="w-full max-w-2xl mx-auto px-4 py-32 text-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
          <Film className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/30">
          404
        </h1>
        <p className="text-2xl font-bold text-foreground">Không tìm thấy trang</p>
        <p className="text-muted-foreground text-base max-w-sm leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 hover:-translate-y-0.5 shadow-lg shadow-primary/30 transition-all duration-200"
        >
          <Home className="w-4 h-4" /> Về trang chủ
        </Link>
      </div>
    </main>
  );
}

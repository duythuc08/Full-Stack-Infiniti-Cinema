import Link from "next/link";
import { Film, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="w-full max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="flex flex-col items-center gap-6">
        <Film className="w-20 h-20 text-muted-foreground" />
        <h1 className="text-white text-6xl font-black">404</h1>
        <p className="text-white text-2xl font-bold">Không tìm thấy trang</p>
        <p className="text-muted-foreground text-lg">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
        >
          <Home className="w-4 h-4" /> Về trang chủ
        </Link>
      </div>
    </main>
  );
}

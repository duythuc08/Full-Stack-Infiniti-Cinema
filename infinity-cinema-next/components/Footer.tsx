import Link from "next/link";
import { Facebook, Film, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex  items-center gap-4">
              <Film className="w-6 h-6 text-primary" />
              <span className="tracking-wider font-semibold">INFINITY CINEMA</span>
                <span className="text-muted-foreground text-sm max-w-xs">
                    Ưu tiên trải nghiệm khách hàng và sự hài lòng là cam kết hàng đầu của chúng tôi.
                </span>
                <span className="text-muted-foreground text-sm">
                     © {currentYear} Infinity Cinema, Inc. Bảo lưu mọi quyền.
                </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Công ty</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Về chúng tôi</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Tuyển dụng</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Liên hệ</Link>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Hỗ trợ</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">CSKH</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Điều khoản sử dụng</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Chính sách bảo mật</Link>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Bảo mật</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Tùy chọn Cookie</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Thông tin công ty</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Liên hệ chúng tôi</Link>
          </div>

          <div className="flex gap-3 mb-8">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
              <Youtube className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

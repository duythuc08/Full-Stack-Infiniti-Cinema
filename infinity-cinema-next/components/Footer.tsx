import Link from "next/link";
import { Facebook, Film, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Film className="w-6 h-6 text-primary flex-shrink-0" />
              <span className="text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
                INFINITY CINEMA
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Ưu tiên trải nghiệm khách hàng và sự hài lòng là cam kết hàng đầu của chúng tôi.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links: Công ty */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">Công ty</p>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Về chúng tôi</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Tuyển dụng</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Liên hệ</Link>
          </div>

          {/* Links: Hỗ trợ */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">Hỗ trợ</p>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">CSKH</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Điều khoản sử dụng</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Chính sách bảo mật</Link>
          </div>

          {/* Links: Bảo mật */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">Bảo mật</p>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Tùy chọn Cookie</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Thông tin công ty</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Liên hệ chúng tôi</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border">
          <p className="text-muted-foreground text-xs text-center sm:text-left">
            © {currentYear} Infinity Cinema, Inc. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}

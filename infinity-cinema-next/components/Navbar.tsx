"use client";

import { useState, useEffect, useCallback } from "react";
import { Film, Search, User, LogOut, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

interface StoredUser {
  firstname: string;
  lastname: string;
  username: string;
  birthday: string;
  memberShipTierName: string;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("pendingOrder");
    setUser(null);
    // Dùng window.location thay vì đóng gói pathname vào dep → tránh tạo reference mới mỗi route change
    if (window.location.pathname !== "/") {
      router.push("/login");
    }
  }, [router]); // bỏ pathname khỏi deps

  const isTokenExpired = (token: string): boolean => {
    if (!token) return true;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const { exp } = JSON.parse(jsonPayload);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  const saveUserToLocal = (rawData: StoredUser) => {
    const filteredUser: StoredUser = {
      firstname: rawData.firstname,
      lastname: rawData.lastname,
      username: rawData.username,
      birthday: rawData.birthday,
      memberShipTierName: rawData.memberShipTierName,
    };
    localStorage.setItem("user", JSON.stringify(filteredUser));
    setUser(filteredUser);
  };

  // Ẩn/hiện Navbar khi scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) setIsVisible(true);
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
        setShowUserMenu(false);
      } else setIsVisible(true);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Xác thực và đồng bộ dữ liệu User
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || isTokenExpired(token)) {
      if (token || storedUser) {
          handleLogout();
      }
      return;
    }

    if (storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }

    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api-proxy/users/myInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          handleLogout();
          return;
        }

        if (res.ok) {
          const data = await res.json();
          saveUserToLocal(data?.result || data);
        }
      } catch (err) {
        console.error("Lỗi cập nhật thông tin user:", err);
      }
    };

    fetchUserInfo();
  }, [pathname, handleLogout]);

  const isActive = (path: string) => pathname === path;

  const BOOKING_PREFIXES = ["/seat-selection/", "/food-selection/", "/payment/", "/payment-success/", "/payment-fail/"];
  if (pathname === "/login" || pathname === "/signup") return null;
  if (BOOKING_PREFIXES.some((p) => pathname.startsWith(p))) return null;

    return (
        <nav
            className={`sticky top-0 w-full z-50 transition-transform duration-300 bg-black border-b border-white/10 shadow-lg backdrop-blur-md ${
                isVisible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Left: Logo & Nav Links */}
                    <div className="flex items-center gap-4 sm:gap-8">
                        <Link href="/" className="flex items-center gap-1 sm:gap-2 group">
                            <Film className="w-6 h-6 sm:w-8 sm:h-8 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(229,115,22,0.7)] shrink-0" />
                            <span className="text-base sm:text-xl md:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 whitespace-nowrap">
                INFINITY CINEMA
              </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            {(["/", "/event"] as const).map((path) => (
                                <Link
                                    key={path}
                                    href={path}
                                    className={`text-base font-medium transition-colors hover:text-primary ${
                                        isActive(path) ? "text-primary" : "text-white"
                                    }`}
                                >
                                    {path === "/" ? "Trang Chủ" : "Sự kiện"}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right: Search, ThemeToggle & User Menu */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-1">
                            {showSearch && (
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm phim..."
                                    className="hidden sm:block h-9 w-48 lg:w-64 rounded-full bg-white/10 border border-white/20 px-4 text-base text-white placeholder:text-white/50 focus:outline-none focus:border-primary focus:bg-white/15 transition-all"
                                />
                            )}
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="cursor-pointer p-2 hover:text-primary transition-colors rounded-full hover:bg-white/10 text-white shrink-0"
                            >
                                <Search className="w-5 h-5 sm:w-5 sm:h-5" />
                            </button>
                        </div>

                        <ThemeToggle />

                        {user ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setShowUserMenu(true)}
                                onMouseLeave={() => setShowUserMenu(false)}
                            >
                                <button className="cursor-pointer flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shrink-0">
                                        <User2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                    </div>
                                    <span className="hidden lg:block text-base font-medium text-white whitespace-nowrap">{user.firstname}</span>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 top-full pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
                                            <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                                                <p className="text-xl text-white">
                                                    {user.firstname} {user.lastname}
                                                </p>
                                                <p className="text-sm uppercase tracking-tighter font-semibold text-primary mt-1">
                                                    {user.memberShipTierName}
                                                </p>
                                            </div>

                                            <div className="p-1">
                                                <button
                                                    onClick={() => router.push("/profile")}
                                                    className="cursor-pointer w-full px-3 py-2 text-left text-base text-white hover:bg-white/10 rounded-md transition-colors flex items-center gap-3"
                                                >
                                                    <User className="w-4 h-4 text-white" />
                                                    Tài khoản của tôi
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="cursor-pointer w-full px-3 py-2 text-left text-base hover:bg-red-500/10 text-red-400 rounded-md transition-colors flex items-center gap-3"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => router.push("/login")}
                                className="cursor-pointer px-4 py-1.5 sm:px-6 sm:py-2 text-sm sm:text-base bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all active:scale-95 whitespace-nowrap shrink-0"
                            >
                                Đăng nhập
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

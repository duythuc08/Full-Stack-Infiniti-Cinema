"use client";

import { Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserInfo, MembershipTier } from "@/types";
import type { ProfileFormState } from "@/types/user.types";

interface Props {
  userInfo: UserInfo | null;
  allTiers: MembershipTier[];
  form: ProfileFormState;
  saving: boolean;
  loading: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (e: React.FormEvent) => void;
}

const TIER_STYLE: Record<string, { text: string; bar: string; bg: string }> = {
  MEMBER:  { text: "text-slate-500", bar: "bg-slate-400",  bg: "bg-slate-100 dark:bg-slate-800/30"  },
  SILVER:  { text: "text-blue-500",  bar: "bg-blue-500",   bg: "bg-blue-100 dark:bg-blue-800/30"    },
  GOLD:    { text: "text-amber-500", bar: "bg-amber-500",  bg: "bg-amber-100 dark:bg-amber-800/30"  },
  DIAMOND: { text: "text-cyan-400",  bar: "bg-cyan-400",   bg: "bg-cyan-100 dark:bg-cyan-800/30"    },
};

export function PersonalInfo({ userInfo, allTiers, form, saving, loading, onFormChange, onSave }: Props) {
  const tierName = userInfo?.membetShipTierName || userInfo?.memberShipTierName || "MEMBER";
  const tier     = TIER_STYLE[tierName] ?? TIER_STYLE["MEMBER"];
  const pts      = userInfo?.loyaltyPoints || 0;

  const nextTier = allTiers.find((t) => (t.pointsRequired || 0) > pts);
  const curTier  = [...allTiers].reverse().find((t) => (t.pointsRequired || 0) <= pts);
  const progressPercent = nextTier
    ? Math.min(100, ((pts - (curTier?.pointsRequired || 0)) / ((nextTier.pointsRequired || 1) - (curTier?.pointsRequired || 0))) * 100)
    : 100;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Membership Widget ── */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-base font-bold text-foreground">Hạng thành viên</h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-3 w-52 rounded" />
          </div>
        ) : (
          <>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${tier.bg} mb-4`}>
              <Star className={`w-4 h-4 ${tier.text}`} />
              <span className={`text-lg font-black ${tier.text}`}>{tierName}</span>
              <span className="text-sm font-medium text-muted-foreground">
                — {pts.toLocaleString("vi-VN")} điểm
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${tier.bar}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {nextTier ? (
                <p className="text-xs text-muted-foreground">
                  Còn{" "}
                  <span className={`font-bold ${tier.text}`}>
                    {(nextTier.pointsRequired - pts).toLocaleString("vi-VN")} điểm
                  </span>{" "}
                  để lên hạng{" "}
                  <span className={`font-bold ${TIER_STYLE[nextTier.name]?.text ?? "text-foreground"}`}>
                    {nextTier.name}
                  </span>
                </p>
              ) : (
                <p className="text-xs text-amber-500 font-medium">✨ Bạn đang ở hạng cao nhất</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Personal Info Form ── */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-base font-bold text-foreground">Thông tin cá nhân</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Cập nhật thông tin hồ sơ của bạn</p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-12 rounded" />
                    <Skeleton className="h-10 rounded-lg" />
                  </div>
                ))}
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-10 rounded-lg" />
                </div>
              ))}
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          ) : (
            <form onSubmit={onSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstname" className="text-sm font-medium text-foreground">Họ</Label>
                  <Input
                    id="firstname"
                    name="firstname"
                    value={form.firstname}
                    onChange={onFormChange}
                    placeholder="Nhập họ"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastname" className="text-sm font-medium text-foreground">Tên</Label>
                  <Input
                    id="lastname"
                    name="lastname"
                    value={form.lastname}
                    onChange={onFormChange}
                    placeholder="Nhập tên"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Email</Label>
                  <Input
                    value={userInfo?.username || ""}
                    disabled
                    className="rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">Số điện thoại</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={onFormChange}
                    placeholder="Nhập số điện thoại"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="sm:max-w-xs space-y-1.5">
                <Label htmlFor="birthday" className="text-sm font-medium text-foreground">Ngày sinh</Label>
                <Input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={form.birthday || ""}
                  onChange={onFormChange}
                  className="rounded-lg"
                />
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer rounded-lg shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all"
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

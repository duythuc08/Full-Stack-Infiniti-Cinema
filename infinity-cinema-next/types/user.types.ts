// ─── Profile Page ────────────────────────────────────────────
export interface ProfileFormState {
  firstname: string;
  lastname: string;
  phoneNumber: string;
  birthday: string;
}

export interface TierConfig {
  color: string;
  glow: string;
  barColor: string;
  animation?: string;
  label: string;
}

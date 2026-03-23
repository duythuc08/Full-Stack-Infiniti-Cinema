// ─── Auth Forms ──────────────────────────────────────────────
export interface LoginFormState {
  email: string;
  password: string;
}

export interface SignupFormState {
  firstname: string;
  lastname: string;
  phoneNumber: string;
  birthday: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export type ForgotPasswordStep = "email" | "verify" | "reset";

// ─── API Payloads ─────────────────────────────────────────────
export interface RegisterPayload {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  birthday: string;
}

// ─── API Results ──────────────────────────────────────────────
export interface LoginResult {
  token?: string;
  authenticated?: boolean;
  enabled?: boolean;
}

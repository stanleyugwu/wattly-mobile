export interface User {
  profile: {
    id: number;
    name: string;
    email: string;
    phone: string;
    refferel_link: string;
    refferel: null;
    email_verified_at: string;
    email_verification_otp: string;
    email_verification_attempts: string;
    email_verification_otp_expires_at: string;
    email_verified_status: "yes" | "no";
    forget_verification_otp: null;
    forgot_password_otp_expires_at: null;
    forgot_password_token: null;
    balance: string;
    transaction_pin: string;
    account_number: string;
    created_at: string;
    updated_at: string;
    profile?: string;
  };
  token: string;
}

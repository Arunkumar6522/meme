export class OTPService {
  // Validate email format (strict, with min TLD length 2 and length bounds)
  static validateEmail(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    // Allow subdomains; require TLD of at least 2 chars; length within 6..254
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return normalized.length >= 6 && normalized.length <= 254 && emailRegex.test(normalized);
  }

  /**
   * Request OTP (server-side generation + DB write + email send).
   * The browser NEVER receives the OTP code.
   */
  static async requestOTP(email: string, type: 'signup' | 'password_reset'): Promise<{ error: string | null }> {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (!OTPService.validateEmail(normalizedEmail)) {
        return { error: 'Invalid email address format' };
      }

      const functionUrl = import.meta.env.VITE_NETLIFY_FUNCTIONS_URL || '/.netlify/functions';
      const response = await fetch(`${functionUrl}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, type }),
      });

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      const payload = contentType.includes('application/json') && text ? JSON.parse(text) : {};

      if (!response.ok) {
        const msg = payload?.error || payload?.message || 'Failed to send verification code';
        // Helpful local-dev hint
        if (import.meta.env.MODE === 'development') {
          return { error: `${msg}. (Tip: run "netlify dev" so functions are available locally.)` };
        }
        return { error: msg };
      }

      return { error: null };
    } catch (error) {
      const msg = (error as Error)?.message || 'Failed to send verification code';
      if (import.meta.env.MODE === 'development') {
        return { error: `${msg}. (Tip: run "netlify dev" so functions are available locally.)` };
      }
      return { error: msg };
    }
  }

  /**
   * Verify OTP (server-side read + expiry check + delete).
   * The browser NEVER reads otp_codes table directly.
   */
  static async verifyOTP(email: string, code: string, type: 'signup' | 'password_reset'): Promise<{ valid: boolean; error: string | null }> {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (!OTPService.validateEmail(normalizedEmail)) {
        return { valid: false, error: 'Invalid email address' };
      }
      if (!/^\d{6}$/.test(code)) {
        return { valid: false, error: 'Invalid verification code format' };
      }

      const functionUrl = import.meta.env.VITE_NETLIFY_FUNCTIONS_URL || '/.netlify/functions';
      const response = await fetch(`${functionUrl}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, code, type }),
      });

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      const payload = contentType.includes('application/json') && text ? JSON.parse(text) : {};

      if (!response.ok) {
        const msg = payload?.error || payload?.message || 'Failed to verify code';
        if (import.meta.env.MODE === 'development') {
          return { valid: false, error: `${msg}. (Tip: run "netlify dev" so functions are available locally.)` };
        }
        return { valid: false, error: msg };
      }

      return {
        valid: Boolean(payload?.valid),
        error: payload?.error || null,
      };
    } catch (error) {
      const msg = (error as Error)?.message || 'Failed to verify code';
      if (import.meta.env.MODE === 'development') {
        return { valid: false, error: `${msg}. (Tip: run "netlify dev" so functions are available locally.)` };
      }
      return { valid: false, error: msg };
    }
  }

  // Clean up expired OTPs (should be called periodically)
  static async cleanupExpiredOTPs(): Promise<void> {
    try {
      // No-op on client: OTP table is now server-only.
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
    }
  }
}
/**
 * Shared validation utilities
 */

/**
 * Validates email format with proper regex
 * Requires TLD length >= 2, allows subdomains
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const normalized = email.trim().toLowerCase();
  
  // Basic length checks
  if (normalized.length < 6 || normalized.length > 254) return false;
  
  // Comprehensive email regex that:
  // - Allows letters, numbers, dots, underscores, percent, plus, hyphens
  // - Requires @ symbol
  // - Allows subdomains
  // - Requires TLD with at least 2 characters
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  
  return emailRegex.test(normalized);
};

/**
 * Validates full name
 */
export const validateFullName = (name: string): { ok: boolean; error?: string } => {
  if (!name || typeof name !== 'string') {
    return { ok: false, error: 'Full name is required' };
  }
  
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: 'Full name is required' };
  
  // Length limits
  if (trimmed.length < 2) return { ok: false, error: 'Name must be at least 2 characters' };
  if (trimmed.length > 30) return { ok: false, error: 'Name must be 30 characters or less' };
  
  // Only allow letters (no spaces, no special characters, no numbers)
  const nameRegex = /^[a-zA-Z]+$/;
  if (!nameRegex.test(trimmed)) {
    return { ok: false, error: 'Name can only contain letters (no spaces or special characters)' };
  }
  
  return { ok: true };
};

/**
 * Validates password
 */
export const validatePassword = (password: string): { ok: boolean; error?: string } => {
  if (!password || typeof password !== 'string') {
    return { ok: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters' };
  }
  
  if (password.length > 128) {
    return { ok: false, error: 'Password is too long (maximum 128 characters)' };
  }
  
  return { ok: true };
};

/**
 * Validates OTP code
 */
export const validateOTP = (code: string): { ok: boolean; error?: string } => {
  if (!code || typeof code !== 'string') {
    return { ok: false, error: 'Verification code is required' };
  }
  
  const trimmed = code.trim();
  if (trimmed.length !== 6) {
    return { ok: false, error: 'Verification code must be 6 digits' };
  }
  
  if (!/^\d{6}$/.test(trimmed)) {
    return { ok: false, error: 'Verification code must contain only numbers' };
  }
  
  return { ok: true };
};
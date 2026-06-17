/**
 * Input validation for order creation — blocks disposable emails, fake phones, etc.
 */

// Known disposable email domains (expandable)
const DISPOSABLE_DOMAINS = new Set([
  "pinmx.net",
  "tempmail.com",
  "throwaway.email",
  "guerrillamail.com",
  "mailinator.com",
  "yopmail.com",
  "sharklasers.com",
  "guerrillamail.info",
  "grr.la",
  "guerrillamail.biz",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "spam4.me",
  "trashmail.com",
  "trashmail.me",
  "trashmail.net",
  "bugmenot.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "tempail.com",
  "tempr.email",
  "temp-mail.org",
  "10minutemail.com",
  "minutemail.com",
  "emailondeck.com",
  "getnada.com",
  "mohmal.com",
  "burnermail.io",
]);

/**
 * Validate email — reject disposable/temp emails
 */
export function validateEmail(email: string | null | undefined): { valid: boolean; message?: string } {
  if (!email) {
    return { valid: false, message: "Email is required" };
  }

  const normalized = email.trim().toLowerCase();

  // Basic format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { valid: false, message: "Invalid email format" };
  }

  // Extract domain
  const domain = normalized.split("@")[1];

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, message: "Disposable email not allowed. Use a real email." };
  }

  return { valid: true };
}

/**
 * Validate phone number — Indonesian format
 * Valid: 08xxxx (10-13 digits) or 8xxxx (9-12 digits without leading 0)
 */
export function validatePhone(phone: string | null | undefined): { valid: boolean; message?: string } {
  if (!phone) {
    return { valid: false, message: "Phone number is required" };
  }

  const cleaned = phone.replace(/[\s\-\+]/g, "");

  // Remove leading 62 (country code)
  let normalized = cleaned;
  if (normalized.startsWith("62")) {
    normalized = normalized.slice(2);
  }

  // Remove leading 0
  if (normalized.startsWith("0")) {
    normalized = normalized.slice(1);
  }

  // Indonesian mobile: starts with 8, total 9-12 digits (without leading 0)
  if (!/^8\d{8,11}$/.test(normalized)) {
    return { valid: false, message: "Invalid phone number. Use Indonesian format (08xxx)." };
  }

  // Reject obvious fakes (all same digit, sequential)
  if (/^(.)\1+$/.test(normalized.slice(1))) {
    return { valid: false, message: "Invalid phone number." };
  }

  // Reject repeated patterns like 1212121212
  if (/^8(\d{1,2})\1{3,}/.test(normalized)) {
    return { valid: false, message: "Invalid phone number." };
  }

  return { valid: true };
}

/**
 * Run all input validations. Returns first error or { valid: true }.
 */
export function validateOrderInput(data: {
  email?: string | null;
  phone?: string | null;
}): { valid: boolean; message?: string } {
  const emailCheck = validateEmail(data.email);
  if (!emailCheck.valid) return emailCheck;

  const phoneCheck = validatePhone(data.phone);
  if (!phoneCheck.valid) return phoneCheck;

  return { valid: true };
}

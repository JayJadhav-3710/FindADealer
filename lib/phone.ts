/** Digits only, preserving leading country code when present. */
export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Normalize Indian mobile numbers to E.164-style digits without '+'.
 * Accepts "+91 90000 00001" and "+919000000006".
 */
export function toWhatsAppNumber(phone: string): string | null {
  const digits = digitsOnly(phone);
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length >= 10) return digits;
  return null;
}

export function telHref(phone: string): string {
  const digits = digitsOnly(phone);
  return digits ? `tel:+${digits}` : "tel:";
}

export function whatsappHref(phone: string): string | null {
  const n = toWhatsAppNumber(phone);
  return n ? `https://wa.me/${n}` : null;
}

export function displayPhone(phone: string): string {
  return phone.trim();
}

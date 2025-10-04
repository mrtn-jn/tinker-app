const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

/**
 * Validates email format according to RFC 5321 (simplified)
 * @param email - Email address to validate
 * @returns Error message in Spanish if invalid, null if valid
 */
export const validateEmail = (email: string): string | null => {
  const trimmed = email.trim();
  
  if (trimmed.length === 0) {
    return 'Por favor, ingresa tu correo electrónico.';
  }
  
  if (trimmed.length > MAX_EMAIL_LENGTH) {
    return 'El correo electrónico es demasiado largo (máximo 254 caracteres).';
  }
  
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Por favor, ingresa un correo electrónico válido.';
  }
  
  return null; // Valid
};

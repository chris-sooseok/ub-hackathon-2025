

/* --- field validators (called on submit only) --- */
export function validateEmail(email) {
  const v = email.trim();
  if (!v) return "Email is required.";

  // username: lowercase letters & digits only; capture domain separately
  const m = v.match(/^([a-z0-9]+)@([^@\s]+)$/);
  if (!m) return "Use your @buffalo.edu email (lowercase letters and numbers only).";

  const domain = m[2].toLowerCase();
  if (domain !== "buffalo.edu") return "Use your @buffalo.edu email.";

  return "";
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  const v = String(password);

  if (v.length < 8) return "Use at least 8 characters.";

  // allow only letters, numbers, and these symbols (no spaces/other chars)
  const allowedChars = /^[A-Za-z0-9!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]+$/;
  if (!allowedChars.test(v)) return "Use only letters, numbers, and standard symbols.";

  if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter.";      // require uppercase
  if (!/[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]/.test(v)) return "Include at least one special character."; // require special

  return "";
}

export function validateConfirmPassword(confirmPassword, password) {
  if (!confirmPassword) return "Please confirm your password.";
  if (confirmPassword !== password) return "Passwords do not match.";
  return "";
}
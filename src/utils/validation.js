export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPassword = (password) => {
  return password.length >= 4;
};

export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Please enter your email';
  }

  if (!password) {
    errors.password = 'Please enter your password';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

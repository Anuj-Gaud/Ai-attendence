export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  password: (password) => {
    return password && password.length >= 6;
  },

  studentId: (id) => {
    return id && id.length >= 3;
  },

  phone: (phone) => {
    const regex = /^[+]?[\d\s-()]+$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  required: (value) => {
    return value !== null && value !== undefined && value !== '';
  },

  minLength: (value, min) => {
    return value && value.length >= min;
  },

  maxLength: (value, max) => {
    return value && value.length <= max;
  },

  alphanumeric: (value) => {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(value);
  },

  numeric: (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  }
};

export const validateForm = (formData, rules) => {
  const errors = {};

  for (const field in rules) {
    const value = formData[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      if (rule.validator && !rule.validator(value)) {
        errors[field] = rule.message;
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default validators;
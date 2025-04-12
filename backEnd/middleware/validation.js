
// utils/validation.js

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 1;
};

const validateUsername = (username) => {
  return typeof username === 'string' && username.trim().length >= 3;
};

const validateRegistration = ({ username, email, password }) => {
    console.log('Login request:', username,email,password); // Debugging line
  const errors = {};

  if (!username || !validateUsername(username)) {
    errors.username = 'Username must be at least 3 characters';
  }

  if (!email || !validateEmail(email)) {
    errors.email = 'Invalid or missing email';
  }

  if (!password || !validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email || !validateEmail(email)) {
    errors.email = 'Invalid or missing email';
  }

  if (!password || !validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateRegistration,
  validateLogin
};

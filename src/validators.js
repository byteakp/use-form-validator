// src/validators.js

/**
 * Built-in validation functions
 */
export const builtInValidators = {
  /**
   * Checks if a value is not empty
   */
  required: (value) => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required';
    }
    if (Array.isArray(value) && value.length === 0) {
      return 'This field is required';
    }
    return '';
  },

  /**
   * Checks if a value is a valid email
   */
  email: (value) => {
    if (!value) return '';
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(value) ? '' : 'Please enter a valid email address';
  },

  /**
   * Checks if a value has a minimum length
   */
  minLength: (value, length = 1) => {
    if (!value) return '';
    
    return value.length >= length ? '' : `Must be at least ${length} characters`;
  },

  /**
   * Checks if a value has a maximum length
   */
  maxLength: (value, length = 100) => {
    if (!value) return '';
    
    return value.length <= length ? '' : `Must be no more than ${length} characters`;
  },

  /**
   * Checks if a value matches a pattern
   */
  pattern: (value, regex, message = 'Invalid format') => {
    if (!value) return '';
    
    return new RegExp(regex).test(value) ? '' : message;
  },

  /**
   * Checks if a value is a number
   */
  number: (value) => {
    if (!value) return '';
    
    return !isNaN(Number(value)) ? '' : 'Must be a number';
  },

  /**
   * Checks if a value is at least a minimum
   */
  min: (value, min) => {
    if (!value) return '';
    
    return Number(value) >= min ? '' : `Must be at least ${min}`;
  },

  /**
   * Checks if a value is at most a maximum
   */
  max: (value, max) => {
    if (!value) return '';
    
    return Number(value) <= max ? '' : `Must be no more than ${max}`;
  },

  /**
   * Checks if a value matches another field's value
   */
  matches: (value, fieldToMatch, values, message = 'Fields do not match') => {
    if (!value) return '';
    
    return value === values[fieldToMatch] ? '' : message;
  },

  /**
   * Checks if a value is a valid URL
   */
  url: (value) => {
    if (!value) return '';
    
    try {
      new URL(value);
      return '';
    } catch {
      return 'Please enter a valid URL';
    }
  },

  /**
   * Checks if a value is a valid date
   */
  date: (value) => {
    if (!value) return '';
    
    const date = new Date(value);
    return !isNaN(date.getTime()) ? '' : 'Please enter a valid date';
  },

  /**
   * Creates a validator that combines multiple validators
   */
  compose: (...validators) => (value, values) => {
    for (const validator of validators) {
      const error = validator(value, values);
      if (error) return error;
    }
    return '';
  }
};

/**
 * Helper to create a custom validator
 */
export const createValidator = (validatorFn, defaultMessage) => (value, values) => {
  return validatorFn(value, values) ? '' : (defaultMessage || 'Validation failed');
};
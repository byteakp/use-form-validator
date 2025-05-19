// src/useFormValidator.js
import { useState, useCallback, useMemo } from 'react';
import { builtInValidators } from './validators';

/**
 * A lightweight form validation hook for React applications
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationSchema - Schema with validation rules
 * @param {Object} options - Additional configuration options
 * @returns {Object} Form state and helper methods
 */
const useFormValidator = (initialValues = {}, validationSchema = {}, options = {}) => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true,
    customValidators = {},
  } = options;

  // Form values state
  const [values, setValues] = useState(initialValues);
  
  // Form touched fields state
  const [touched, setTouched] = useState({});
  
  // Form errors state
  const [errors, setErrors] = useState({});
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combine built-in validators with any custom validators
  const validators = useMemo(() => ({
    ...builtInValidators,
    ...customValidators,
  }), [customValidators]);

  /**
   * Validates a single field
   */
  const validateField = useCallback((name, value) => {
    if (!validationSchema[name]) return '';

    const fieldRules = validationSchema[name];
    
    // Handle array of rules
    if (Array.isArray(fieldRules)) {
      for (const rule of fieldRules) {
        // Handle rule as string (built-in validator)
        if (typeof rule === 'string' && validators[rule]) {
          const error = validators[rule](value);
          if (error) return error;
        }
        
        // Handle rule as object with validator and message
        if (typeof rule === 'object') {
          const { validator, message, params = [] } = rule;
          
          // Handle validator as string (reference to a validator function)
          if (typeof validator === 'string' && validators[validator]) {
            if (!validators[validator](value, ...params)) {
              return message || `Validation failed for ${name}`;
            }
          }
          
          // Handle validator as custom function
          if (typeof validator === 'function') {
            if (!validator(value, ...params)) {
              return message || `Validation failed for ${name}`;
            }
          }
        }
        
        // Handle rule as function
        if (typeof rule === 'function') {
          const error = rule(value, values);
          if (error) return error;
        }
      }
      return '';
    }
    
    // Handle simple string rule
    if (typeof fieldRules === 'string' && validators[fieldRules]) {
      return validators[fieldRules](value) || '';
    }
    
    // Handle function rule
    if (typeof fieldRules === 'function') {
      return fieldRules(value, values) || '';
    }
    
    // Handle object rule (similar to Yup schema)
    if (typeof fieldRules === 'object') {
      const { validator, message, params = [] } = fieldRules;
      
      if (typeof validator === 'string' && validators[validator]) {
        if (!validators[validator](value, ...params)) {
          return message || `Validation failed for ${name}`;
        }
      }
      
      if (typeof validator === 'function') {
        if (!validator(value, ...params)) {
          return message || `Validation failed for ${name}`;
        }
      }
    }
    
    return '';
  }, [validators, validationSchema, values]);

  /**
   * Validates all form fields
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    let hasErrors = false;

    Object.keys(validationSchema).forEach((field) => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [validateField, validationSchema, values]);

  /**
   * Handles input change
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    
    if (validateOnChange && touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [validateField, validateOnChange, touched]);

  /**
   * Sets a specific field value
   */
  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    if (validateOnChange && touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [validateField, validateOnChange, touched]);

  /**
   * Handles input blur
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    if (validateOnBlur) {
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [validateField, validateOnBlur, values]);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    let isValid = true;
    if (validateOnSubmit) {
      isValid = validateForm();
    }
    
    setIsSubmitting(true);
    
    if (isValid && onSubmit) {
      try {
        await onSubmit(values, { setErrors, resetForm });
      } catch (err) {
        console.error('Form submission error:', err);
      }
    }
    
    setIsSubmitting(false);
  }, [validateOnSubmit, validateForm, values]);

  /**
   * Resets the form
   */
  const resetForm = useCallback((newValues = {}) => {
    setValues(newValues || initialValues);
    setTouched({});
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Create field props getters
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
  }), [values, handleChange, handleBlur]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    resetForm,
    validateForm,
    getFieldProps,
  };
};

export default useFormValidator;
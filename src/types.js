// src/types.js
/**
 * @typedef {Object} ValidationRule
 * @property {string|Function} validator - The validator function or name of built-in validator
 * @property {string} [message] - Custom error message
 * @property {Array<any>} [params] - Additional parameters for the validator
 */

/**
 * @typedef {Object} ValidationSchema
 * @property {string|Function|ValidationRule|Array<string|Function|ValidationRule>} [fieldName] - Validation rules for a field
 */

/**
 * @typedef {Object} FormValidatorOptions
 * @property {boolean} [validateOnChange=true] - Whether to validate on change
 * @property {boolean} [validateOnBlur=true] - Whether to validate on blur
 * @property {boolean} [validateOnSubmit=true] - Whether to validate on submit
 * @property {Object<string, Function>} [customValidators={}] - Custom validators
 */

/**
 * @typedef {Object} FormValidatorResult
 * @property {Object} values - Form values
 * @property {Object} errors - Form errors
 * @property {Object} touched - Form touched fields
 * @property {boolean} isSubmitting - Whether the form is submitting
 * @property {boolean} isValid - Whether the form is valid
 * @property {Function} handleChange - Change handler
 * @property {Function} handleBlur - Blur handler
 * @property {Function} handleSubmit - Submit handler
 * @property {Function} setValue - Set a field value
 * @property {Function} resetForm - Reset the form
 * @property {Function} validateForm - Validate the form
 * @property {Function} getFieldProps - Get props for a field
 */

// Export TypeScript types for TypeScript users
/**
 * @template T
 * @typedef {Object} TypedFormValidatorResult
 * @property {T} values - Form values
 * @property {Partial<Record<keyof T, string>>} errors - Form errors
 * @property {Partial<Record<keyof T, boolean>>} touched - Form touched fields
 * @property {boolean} isSubmitting - Whether the form is submitting
 * @property {boolean} isValid - Whether the form is valid
 * @property {(e: { target: { name: string; value: any } }) => void} handleChange - Change handler
 * @property {(e: { target: { name: string } }) => void} handleBlur - Blur handler
 * @property {(onSubmit: (values: T, helpers: { setErrors: Function, resetForm: Function }) => void | Promise<void>) => (e: Event) => void} handleSubmit - Submit handler
 * @property {<K extends keyof T>(name: K, value: T[K]) => void} setValue - Set a field value
 * @property {(newValues?: Partial<T>) => void} resetForm - Reset the form
 * @property {() => boolean} validateForm - Validate the form
 * @property {<K extends keyof T>(name: K) => Object} getFieldProps - Get props for a field
 */
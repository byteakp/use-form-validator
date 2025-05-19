# validux

A lightweight, flexible form validation hook for React applications.

## Features

- 🪶 **Lightweight**: Small bundle size with zero dependencies
- 🔄 **Flexible**: Works with any form structure
- ⚡ **Powerful**: Built-in validators and support for custom validators
- 🎯 **Simple API**: Easy to integrate with existing forms
- 📝 **TypeScript Support**: Includes type definitions
- 🔍 **Async Validation**: Support for asynchronous validators
- 💪 **Extensible**: Create custom validators easily

## Installation

```bash
npm install validux
# or
yarn add validux
```

## Basic Usage

```jsx
import React from 'react';
import useFormValidator from 'validux';

function LoginForm() {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
  } = useFormValidator(
    // Initial values
    {
      email: '',
      password: '',
    },
    // Validation schema
    {
      email: ['required', 'email'],
      password: ['required', { validator: 'minLength', params: [8], message: 'Password must be at least 8 characters' }],
    }
  );

  const onSubmit = async (formValues) => {
    // Submit logic here
    console.log('Form submitted with values:', formValues);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Login successful!');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          {...getFieldProps('email')}
        />
        {touched.email && errors.email && (
          <div>{errors.email}</div>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...getFieldProps('password')}
        />
        {touched.password && errors.password && (
          <div>{errors.password}</div>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## API Reference

### `useFormValidator(initialValues, validationSchema, options)`

The main hook that provides form validation.

#### Parameters

- `initialValues` (Object): The initial values of the form
- `validationSchema` (Object): The validation rules for each field
- `options` (Object, optional): Additional configuration options
  - `validateOnChange` (Boolean, default: `true`): Whether to validate fields on change
  - `validateOnBlur` (Boolean, default: `true`): Whether to validate fields on blur
  - `validateOnSubmit` (Boolean, default: `true`): Whether to validate all fields on submit
  - `customValidators` (Object, default: `{}`): Custom validators

#### Returns

- `values` (Object): Current form values
- `errors` (Object): Validation errors for each field
- `touched` (Object): Indicates which fields have been touched
- `isSubmitting` (Boolean): Whether the form is currently submitting
- `isValid` (Boolean): Whether the form is valid (no errors)
- `handleChange` (Function): Change handler for inputs
- `handleBlur` (Function): Blur handler for inputs
- `handleSubmit` (Function): Submit handler for form
- `setValue` (Function): Set a field value programmatically
- `resetForm` (Function): Reset the form to its initial values
- `validateForm` (Function): Validate all form fields
- `getFieldProps` (Function): Get props for a field (name, value, onChange, onBlur)

## Validation Schema

The validation schema defines the validation rules for each field. You can specify validation rules in several ways:

### String (Built-in Validator)

```js
{
  email: 'email',
  username: 'required'
}
```

### Array of Rules

```js
{
  password: [
    'required', 
    { validator: 'minLength', params: [8], message: 'Password must be at least 8 characters' }
  ]
}
```

### Custom Function

```js
{
  confirmPassword: (value, values) => value === values.password ? '' : 'Passwords do not match'
}
```

### Object with Validator, Params, and Message

```js
{
  age: { validator: 'min', params: [18], message: 'You must be at least 18 years old' }
}
```

## Built-in Validators

- `required`: Field must not be empty
- `email`: Field must be a valid email address
- `minLength`: Field must have at least a minimum length
- `maxLength`: Field must have at most a maximum length
- `pattern`: Field must match a regex pattern
- `number`: Field must be a number
- `min`: Field must be at least a minimum value
- `max`: Field must be at most a maximum value
- `url`: Field must be a valid URL
- `date`: Field must be a valid date

## Custom Validators

You can create custom validators in two ways:

### Using `createValidator`

```js
import { createValidator } from 'validux';

const isEven = createValidator(
  value => parseInt(value) % 2 === 0,
  'Value must be an even number'
);

// Use in schema
{
  number: isEven
}
```

### Using Custom Validators Option

```js
const customValidators = {
  strongPassword: (value) => {
    if (!value) return '';
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    
    return '';
  }
};

// Use in hook options
useFormValidator(initialValues, validationSchema, { customValidators });

// Then in schema
{
  password: 'strongPassword'
}
```

## Async Validation

You can use async validators for checking values against an API:

```js
const customValidators = {
  uniqueUsername: async (value) => {
    if (!value) return '';
    
    try {
      const response = await fetch(`/api/check-username?username=${value}`);
      const data = await response.json();
      
      return data.isAvailable ? '' : 'Username is already taken';
    } catch (error) {
      console.error('Username validation error:', error);
      return 'Failed to validate username';
    }
  }
};
```

## Examples

Check out the [examples](./examples) directory for more complete examples:

- [Basic Login Form](./examples/basic-form/LoginForm.jsx)
- [Advanced Registration Form](./examples/advanced-form/RegistrationForm.jsx)

## License

MIT
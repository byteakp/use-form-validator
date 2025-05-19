// tests/useFormValidator.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import useFormValidator from '../src/useFormValidator';

describe('useFormValidator', () => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
  };
  
  const validationSchema = {
    name: 'required',
    email: ['required', 'email'],
    password: [
      'required',
      { validator: 'minLength', params: [8], message: 'Password must be at least 8 characters' }
    ],
  };

  test('should initialize with empty values', () => {
    const { result } = renderHook(() => useFormValidator());
    
    expect(result.current.values).toEqual({});
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isValid).toBe(true);
  });

  test('should initialize with provided values', () => {
    const { result } = renderHook(() => useFormValidator(initialValues));
    
    expect(result.current.values).toEqual(initialValues);
  });

  test('should handle input changes', () => {
    const { result } = renderHook(() => useFormValidator(initialValues, validationSchema));
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' }
      });
    });
    
    expect(result.current.values.name).toBe('John Doe');
  });

  test('should validate on input change when touched', () => {
    const { result } = renderHook(() => 
      useFormValidator(initialValues, validationSchema, { validateOnChange: true })
    );
    
    // First set the field as touched
    act(() => {
      result.current.handleBlur({
        target: { name: 'email' }
      });
    });
    
    // Then change the value
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'invalid-email' }
      });
    });
    
    expect(result.current.errors.email).toBeTruthy();
  });

  test('should validate on blur', () => {
    const { result } = renderHook(() => 
      useFormValidator(initialValues, validationSchema, { validateOnBlur: true })
    );
    
    act(() => {
      result.current.handleBlur({
        target: { name: 'name' }
      });
    });
    
    expect(result.current.touched.name).toBe(true);
    expect(result.current.errors.name).toBe('This field is required');
  });

  test('should validate on submit', async () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() => 
      useFormValidator(initialValues, validationSchema)
    );
    
    await act(async () => {
      const submitHandler = result.current.handleSubmit(mockSubmit);
      await submitHandler({ preventDefault: jest.fn() });
    });
    
    // Since all fields are invalid, the submit function should not be called
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(result.current.isValid).toBe(false);
    expect(Object.keys(result.current.errors)).toHaveLength(3);
  });

  test('should call onSubmit when form is valid', async () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() => 
      useFormValidator(initialValues, validationSchema)
    );
    
    // Set valid values
    act(() => {
      result.current.setValue('name', 'John Doe');
      result.current.setValue('email', 'john@example.com');
      result.current.setValue('password', 'Password123!');
    });
    
    await act(async () => {
      const submitHandler = result.current.handleSubmit(mockSubmit);
      await submitHandler({ preventDefault: jest.fn() });
    });
    
    expect(mockSubmit).toHaveBeenCalledWith(
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      },
      expect.any(Object)
    );
  });

  test('should reset form', () => {
    const { result } = renderHook(() => 
      useFormValidator(initialValues, validationSchema)
    );
    
    // Change values
    act(() => {
      result.current.setValue('name', 'John Doe');
    });
    
    // Reset form
    act(() => {
      result.current.resetForm();
    });
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  test('should reset form with new values', () => {
    const { result } = renderHook(() => 
      useFormValidator(initialValues, validationSchema)
    );
    
    const newValues = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'securePassword123!',
    };
    
    // Reset form with new values
    act(() => {
      result.current.resetForm(newValues);
    });
    
    expect(result.current.values).toEqual(newValues);
  });

  test('getFieldProps should return correct props', () => {
    const { result } = renderHook(() => 
      useFormValidator(initialValues)
    );
    
    const nameProps = result.current.getFieldProps('name');
    
    expect(nameProps).toEqual({
      name: 'name',
      value: '',
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });
});
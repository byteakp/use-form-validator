// tests/validators.test.js
import { builtInValidators, createValidator } from '../src/validators';

describe('validators', () => {
  describe('required', () => {
    test('should validate required values', () => {
      expect(builtInValidators.required('')).toBeTruthy();
      expect(builtInValidators.required(null)).toBeTruthy();
      expect(builtInValidators.required(undefined)).toBeTruthy();
      expect(builtInValidators.required([])).toBeTruthy();
      
      expect(builtInValidators.required('value')).toBe('');
      expect(builtInValidators.required(0)).toBe('');
      expect(builtInValidators.required(false)).toBe('');
      expect(builtInValidators.required([1])).toBe('');
    });
  });

  describe('email', () => {
    test('should validate email addresses', () => {
      expect(builtInValidators.email('')).toBe('');
      expect(builtInValidators.email('not-an-email')).toBeTruthy();
      expect(builtInValidators.email('test@example')).toBeTruthy();
      
      expect(builtInValidators.email('test@example.com')).toBe('');
      expect(builtInValidators.email('user.name+tag@example.co.uk')).toBe('');
    });
  });

  describe('minLength', () => {
    test('should validate minimum length', () => {
      expect(builtInValidators.minLength('', 3)).toBe('');
      expect(builtInValidators.minLength('ab', 3)).toBeTruthy();
      
      expect(builtInValidators.minLength('abc', 3)).toBe('');
      expect(builtInValidators.minLength('abcd', 3)).toBe('');
    });
  });

  describe('maxLength', () => {
    test('should validate maximum length', () => {
      expect(builtInValidators.maxLength('', 3)).toBe('');
      expect(builtInValidators.maxLength('abcd', 3)).toBeTruthy();
      
      expect(builtInValidators.maxLength('abc', 3)).toBe('');
      expect(builtInValidators.maxLength('ab', 3)).toBe('');
    });
  });

  describe('pattern', () => {
    test('should validate against patterns', () => {
      expect(builtInValidators.pattern('', /^\d+$/)).toBe('');
      expect(builtInValidators.pattern('abc', /^\d+$/)).toBeTruthy();
      
      expect(builtInValidators.pattern('123', /^\d+$/)).toBe('');
      expect(builtInValidators.pattern('abc123', /^[a-z\d]+$/)).toBe('');
    });
  });

  describe('number', () => {
    test('should validate numbers', () => {
      expect(builtInValidators.number('')).toBe('');
      expect(builtInValidators.number('abc')).toBeTruthy();
      
      expect(builtInValidators.number('123')).toBe('');
      expect(builtInValidators.number('-123.45')).toBe('');
    });
  });

  describe('min', () => {
    test('should validate minimum value', () => {
      expect(builtInValidators.min('', 10)).toBe('');
      expect(builtInValidators.min('5', 10)).toBeTruthy();
      
      expect(builtInValidators.min('10', 10)).toBe('');
      expect(builtInValidators.min('15', 10)).toBe('');
    });
  });

  describe('max', () => {
    test('should validate maximum value', () => {
      expect(builtInValidators.max('', 10)).toBe('');
      expect(builtInValidators.max('15', 10)).toBeTruthy();
      
      expect(builtInValidators.max('10', 10)).toBe('');
      expect(builtInValidators.max('5', 10)).toBe('');
    });
  });

  describe('url', () => {
    test('should validate URLs', () => {
      expect(builtInValidators.url('')).toBe('');
      expect(builtInValidators.url('not-a-url')).toBeTruthy();
      
      expect(builtInValidators.url('https://example.com')).toBe('');
      expect(builtInValidators.url('http://example.com/path?query=value')).toBe('');
    });
  });

  describe('date', () => {
    test('should validate dates', () => {
      expect(builtInValidators.date('')).toBe('');
      expect(builtInValidators.date('not-a-date')).toBeTruthy();
      
      expect(builtInValidators.date('2023-09-15')).toBe('');
      expect(builtInValidators.date('09/15/2023')).toBe('');
    });
  });

  describe('compose', () => {
    test('should compose multiple validators', () => {
      const isEvenAndPositive = builtInValidators.compose(
        (value) => parseInt(value) % 2 === 0 ? '' : 'Must be even',
        (value) => parseInt(value) > 0 ? '' : 'Must be positive'
      );
      
      expect(isEvenAndPositive('-2')).toBeTruthy();
      expect(isEvenAndPositive('3')).toBeTruthy();
      expect(isEvenAndPositive('2')).toBe('');
    });
  });

  describe('createValidator', () => {
    test('should create custom validators', () => {
      const isEven = createValidator(
        (value) => parseInt(value) % 2 === 0,
        'Must be an even number'
      );
      
      expect(isEven('1')).toBe('Must be an even number');
      expect(isEven('2')).toBe('');
    });

    test('should work with custom message', () => {
      const isMultipleOf = createValidator(
        (value, multiplier) => parseInt(value) % multiplier === 0,
        (value, multiplier) => `Must be a multiple of ${multiplier}`
      );
      
      expect(isMultipleOf('5', 3)).toBe('Must be a multiple of 3');
      expect(isMultipleOf('6', 3)).toBe('');
    });
  });
});
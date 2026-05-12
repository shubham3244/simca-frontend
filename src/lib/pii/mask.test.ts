import { describe, expect, it } from 'vitest';
import { maskCardNumber, maskEmail, maskPhone, maskVin } from './mask';

describe('maskPhone', () => {
  it('masks a formatted phone number with parens and dash', () => {
    expect(maskPhone('(555) 123-4567')).toBe('(555) ***-4567');
  });

  it('masks a phone with dashes only', () => {
    expect(maskPhone('555-123-4567')).toBe('(555) ***-4567');
  });

  it('masks a raw 10-digit phone', () => {
    expect(maskPhone('5551234567')).toBe('(555) ***-4567');
  });

  it('strips a leading +1 country code', () => {
    expect(maskPhone('+1 (555) 123-4567')).toBe('(555) ***-4567');
  });

  it('returns the original string if not 10 digits', () => {
    expect(maskPhone('123')).toBe('123');
  });
});

describe('maskEmail', () => {
  it('keeps first character + domain, masks the rest', () => {
    expect(maskEmail('john.smith@example.com')).toBe('j***@example.com');
  });
});

describe('maskVin', () => {
  it('keeps first 3 and last 4 characters of a VIN', () => {
    expect(maskVin('1HGBH41JXMN109186')).toBe('1HG****9186');
  });
});

describe('maskCardNumber', () => {
  it('shows only last 4 digits regardless of length', () => {
    expect(maskCardNumber('4111111111111234')).toBe('**** **** **** 1234');
  });
});

export const simulateApiCall = (duration: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, duration));

export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');

  // ✅ India-specific (10 digits, may start with +91 or 0)
  const indiaRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

  // ✅ Generic E.164 (for other countries)
  const internationalRegex = /^\+?[1-9]\d{7,14}$/;

  return indiaRegex.test(cleaned) || internationalRegex.test(cleaned);
};

export const validateOtp = (otp: string): boolean => {
  // Simple validation: check if it's 6 digits
  const otpRegex = /^\d{4}$/;
  return otpRegex.test(otp);
};

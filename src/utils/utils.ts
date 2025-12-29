export const displayText = (str: string, limit: number = 50) =>
  str ? (str.length > limit ? str.slice(0, limit) + '...' : str) : 'N/A';

export const displayPrice = (price: number | string) =>
  `₹${Math.round(+price)}`;

export const normalization = (text: string): string => {
  return text.replace(/[.\s]/g, '').toLowerCase();
};

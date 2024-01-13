export const sanitizeString = (input: string) => {
  const sanitizedString = input
    .toLowerCase()
    .replace(/[^\p{L}0-9.-]+/gu, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

  return sanitizedString;
};
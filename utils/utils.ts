export const sanitizeString = (input) => {
    return input
      .toLowerCase()
      .replace(/[^\p{L}0-9.-]+/gu, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
};
  
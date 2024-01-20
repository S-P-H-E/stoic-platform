export const sanitizeString = (input: string) => {
  const sanitizedString = input
    .toLowerCase()
    .replace(/[^\p{L}0-9.-]+/gu, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

  return sanitizedString;
};

export function truncateText(text: string | undefined | null, maxLength: number) {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

export const isUserAllowedToFetch = (status) => status === 'premium' || status === 'admin';

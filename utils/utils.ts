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

export const isUserAllowedToFetch = (status: string | undefined) => status === 'premium' || status === 'admin';

export function parseChannelIdFromUrl(url: string) {
  const regex = /(https?:\/\/)?(www\.)?youtu((\.be)|(be\..{2,5}))\/((user)|(channel))\/?([a-zA-Z0-9\-_]{1,})/;
  const match = url.match(regex);

  if (match && match[9]) {
    return match[9];
  } else {
    return null;
  }
}

export function formatNumber(number: number): string {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    return (number / 1000000).toFixed(1) + 'M';
  }
}

export function formatNumberCompact(number: number): string {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(2) + 'K';
  } else {
    return (number / 1000000).toFixed(2) + 'M';
  }
}
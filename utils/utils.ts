import {Role} from "@/types/types";
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export const sanitizeString = (input: string) => {
    const sanitizedString = input
        .toLowerCase()
        .replace(/[^\p{L}0-9.-]+/gu, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');

    return sanitizedString;
};

export const sanitizeForUrl = (input: string) => {
  const sanitizedString = input
      .toLowerCase()
      .replace(/[^\p{L}0-9.-]+/gu, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');

  return encodeURIComponent(sanitizedString);
};

export function truncateText(text: string | undefined | null, maxLength: number) {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

export function parseChannelIdFromUrl(url: string) {
  const regex = /(https?:\/\/)?(www\.)?youtu((\.be)|(be\..{2,5}))\/((user)|(channel))\/?([a-zA-Z0-9\-_]{1,})/;
  const match = url.match(regex);

  if (match && match[9]) {
    return match[9];
  } else {
    return null;
  }
}

export function getUserRoleColor(userRoles: Role[] | 'User'): string {
  if (userRoles === 'User' || userRoles.length === 0) {
    return 'white';
  }

  const leastOrderRole = userRoles.reduce(
      (minRole, currentRole) =>
          minRole.order < currentRole.order ? minRole : currentRole,
      userRoles[0]
  );

  return leastOrderRole.color;
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


export function convertToAsciiEquivalent(input: string): string {
  // Normalize the string to handle Unicode characters
  const normalizedString = input.normalize('NFD');
  // Use a regular expression to remove non-ASCII characters
  const asciiEquivalentString = normalizedString.replace(/[^\x00-\x7F]/g, '');

  // Sanitize the ASCII equivalent string
  const sanitizedString = asciiEquivalentString
      .toLowerCase()
      .replace(/[^\p{L}0-9.-]+/gu, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');

  return sanitizedString;
}

export function capitalizeFirstLetter(input: string): string {
  if (!input) {
    return '';
  }

  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function isValidURL(value: string | undefined, socialPlatform: string): boolean {
  if (!value) {
    return true;
  }

  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  let prefixRegex;
  switch (socialPlatform) {
    case 'youtube':
      prefixRegex = /^https?:\/\/(www\.)?youtube\.com/;
      break;
    case 'instagram':
      prefixRegex = /^https?:\/\/(www\.)?instagram\.com/;
      break;
    case 'twitter':
      prefixRegex = /^https?:\/\/(www\.)?twitter\.com/;
      break;
    case 'tiktok':
      prefixRegex = /^https?:\/\/(www\.)?tiktok\.com/;
      break;
    default:
      return false;  // Unknown social platform
  }

  return urlRegex.test(value) && prefixRegex.test(value);
}

export const isUserAllowedToFetch = (status: string | undefined) => status === 'premium' || status === 'admin';

export const encrypt = (data: string, key: Buffer): string => {
  const iv = randomBytes(16); // Generate random initialization vector
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return iv.toString('hex') + ':' + encryptedData;
};

export const decrypt = (encryptedData: string, key: Buffer): string => {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts.shift()!, 'hex');
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  let decryptedData = decipher.update(parts.join(':'), 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};
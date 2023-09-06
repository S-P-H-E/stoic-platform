// rumbleParser.ts

export function convertRumbleURLToAPIURL(rumbleURL: string): string | null {
  const rumblePattern = /^https:\/\/rumble\.com\/([a-zA-Z0-9-]+\.html)$/;
  const match = rumbleURL.match(rumblePattern);

  if (match && match[1]) {
    const videoId = match[1];
    return `https://rumble-videos.p.rapidapi.com/${videoId}`;
  }

  return null; // Return null for invalid Rumble URLs
}

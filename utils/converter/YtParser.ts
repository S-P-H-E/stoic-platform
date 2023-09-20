export function YoutubeParser(url: string) {
  // Regular expression to match both regular YouTube video URLs and YouTube Shorts URLs
  var regExp = /^(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?.*?v=)?|https?:\/\/youtu.be\/|https?:\/\/www\.youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  var match = url.match(regExp);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return false;
}
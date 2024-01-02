export function YoutubeParser(url: string) {
  var regExp = /^(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?.*?v=)?|https?:\/\/youtu.be\/|https?:\/\/www\.youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  var match = url.match(regExp);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return false;
}

export function isYoutubeUrl(url: string): boolean {
  var regExp = /^(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?.*?v=)?|https?:\/\/youtu.be\/|https?:\/\/www\.youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  return regExp.test(url);
}
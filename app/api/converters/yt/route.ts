import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';
import { format } from 'date-fns';

function extractNumericPart(quality: string) {
  const match = quality.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

export async function POST(request: NextRequest, response: NextResponse) {
  const body = await request.json();
  const { vidUrl } = body;

  try {
    const info = await ytdl.getInfo(vidUrl);

    const videoFormats = ytdl.filterFormats(info.formats, 'video');

    const uniqueFormatsMap = new Map();

    videoFormats.forEach((format) => {
      const quality = format.qualityLabel;

      // if format with the same quality doesn't exist or has higher resolution, add it to the map
      if (
        !uniqueFormatsMap.has(quality) ||
        (format.width && (!uniqueFormatsMap.get(quality) || format.width > uniqueFormatsMap.get(quality)!.width))
      ) {
        uniqueFormatsMap.set(quality, format);
      }
    });

    // Convert map values to an array of objects
    const downloadLinks = Array.from(uniqueFormatsMap.values()).map((format) => ({
      quality: format.qualityLabel,
      url: format.url,
    }));

    downloadLinks.sort((a, b) => {
      const qualityA = extractNumericPart(a.quality);
      const qualityB = extractNumericPart(b.quality);
      return qualityB - qualityA;
    });

    const authorThumbnails = info.videoDetails.author.thumbnails;

    const bestQualityAuthorThumbnail = authorThumbnails?.reduce((prev, current) => {
      return prev.width > current.width ? prev : current;
    });

    const thumbnailUrl = info.videoDetails.thumbnails.reduce((prev, current) => {
      return prev.width > current.width ? prev : current;
    }).url;

    const authorThumbnailUrl = bestQualityAuthorThumbnail?.url;

    const audioFormats = ytdl.filterFormats(info.formats, 'audio');

    const bestAudioFormat = audioFormats.reduce((prev, current) => {
      // Ignore video formats in the audio selection process
      if (current.hasVideo) {
        return prev;
      }
    
      // Prioritize formats with higher audioBitrate
      if (prev.audioBitrate && current.audioBitrate && prev.audioBitrate > current.audioBitrate) {
        return prev;
      }
    
      // If audioBitrates are equal, prioritize formats with 'opus' codec
      if (prev.audioBitrate === current.audioBitrate && prev.codecs && prev.codecs.includes('opus')) {
        return prev;
      }
    
      // If audioBitrates and codecs are equal, prioritize the first encountered format
      return current;
    });
    

    const audioDownloadLink = bestAudioFormat
    ? {
        url: bestAudioFormat.url,
      }
    : null;

    const author = {
      id: info.videoDetails.author.id,
      name: info.videoDetails.author.name,
      user: info.videoDetails.author.user,
      channel_url: info.videoDetails.author.channel_url,
      external_channel_url: info.videoDetails.author.external_channel_url,
      user_url: info.videoDetails.author.user_url,
    };

    const videoUrl = info.videoDetails.video_url;
    const videoTitle = info.videoDetails.title;

    /*console.log(info)*/

    const formattedDate = format(info.videoDetails.uploadDate, 'MM/dd/yyyy');

    const uploadDate = formattedDate
    const lengthSeconds = info.videoDetails.lengthSeconds;

    return new Response(JSON.stringify({info, audioFormats, bestAudioFormat, audioDownloadLink, videoTitle, downloadLinks, thumbnailUrl, videoUrl, author, authorThumbnailUrl, uploadDate, lengthSeconds}));
  } catch (error: any) {
    /*console.log(error)*/
    if (error.message.includes('No video id found')) {
      return new Response('Error fetching video information: No video ID found', { status: 404 });
    } else if(error.message.includes('does not match expected format')) {
      return new Response('Video url seems to be corrupted. Check again to see if you did a typo.', { status: 404 });
    }
    else {
      return new Response('Error fetching video information', { status: 500 });
    }
  }
}

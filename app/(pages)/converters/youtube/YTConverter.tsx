'use client';
import { useState } from 'react';
import Input from '@/components/Converter/Input';
import Button from '@/components/UI Elements/Button';
import { message } from 'antd';
import { isYoutubeUrl } from '@/utils/converter/YtParser';
import clsx from 'clsx';
import { BiLoader } from 'react-icons/bi';
import { ScaleLoader } from 'react-spinners';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ButtonShad } from '@/components/ui/buttonshad';
import { DialogClose } from '@radix-ui/react-dialog';
import SocialLink from '@/components/Converter/SocialLink';
import { BsMusicNote } from 'react-icons/bs';
import { SiTiktok } from 'react-icons/si';
import Image from 'next/image';
import { FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import { HiDownload } from 'react-icons/hi';
import { YoutubeIcon } from 'lucide-react';
import {UserDataFetcher} from "@/utils/userDataFetcher";
import {isUserAllowedToFetch} from "@/utils/utils";

interface Author {
  id: string;
  name: string;
  user: string;
  channel_url: string;
  external_channel_url: string;
  user_url: string;
}

interface VideoLink {
  quality: string;
  url: string;
}

interface AudioLink {
  url: string;
}

interface VideoInfo {
  downloadLinks: VideoLink[];
  thumbnailUrl: string;
  videoUrl: string;
  audioDownloadLink?: AudioLink | null;
  author: Author;
  authorThumbnailUrl: string;
  uploadDate: string;
  lengthSeconds: number;
  videoTitle: string;
}

export default function YTConverterComponent() {
  const [vidUrl, setVidUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo>();

  const { userStatus } = UserDataFetcher();
  const allowedToFetch = isUserAllowedToFetch(userStatus)

  const handleConvertClick = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/converters/yt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vidUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setVideoInfo(data);

        console.log(data.audioFormats);
        console.log(data.bestAudioFormat);
      } else {
        const errorMessage = await response.text();
        console.error('Error fetching video information:', errorMessage);
        message.error(errorMessage);
      }
    } catch (error) {
      console.error('Error fetching video information:', error);
    } finally {
      setLoading(false);
    }
  };

  const correctYtUrl = isYoutubeUrl(vidUrl);

  return (
    <div className="min-h-screen p-12 gap-4 flex flex-col items-center justify-center max-w-6xl w-full mx-auto">
      {/* <YoutubeIcon size={80}/> */}
      <div className="text-center space-y-2">
        
        <h1 className="text-5xl font-semibold">
          <span className="text-red-600">YouTube</span> Converter
        </h1>
        <p className="text-highlight font-light">
          Paste the link of the YouTube video you want to download, then select
          which quality and download!
        </p>
      </div>

      <Input
        type="text"
        placeholder="Enter YouTube video URL"
        value={vidUrl}
        disabled={loading || !allowedToFetch}
        onChange={(e) => setVidUrl(e.target.value)}
      />

      {!correctYtUrl ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className={clsx(
                correctYtUrl && 'bg-red-600 hover:bg-red-500 border-red-500'
              )}
              onClick={correctYtUrl ? handleConvertClick : undefined}
              disabled={loading || vidUrl.length == 0}
            >
              {loading ? (
                <div className="flex gap-2 items-center">
                  <BiLoader className="animate-spin" /> Loading...
                </div>
              ) : vidUrl.length == 0 ? (
                'Empty'
              ) : (
                'Convert Video'
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col gap-2 p-8 items-center justify-center text-center">
              <h1 className="text-2xl font-semibold">Confirmation</h1>
              <p className="opacity-80 font-light">
                This URL doesn&apos;t appear to be a valid YouTube video link.
                Are you sure you want to proceed with the conversion?
              </p>
              <div className="flex gap-2 mt-2">
                <DialogClose asChild>
                  <ButtonShad className="bg-white hover:bg-white/80 text-black border border-white">
                    Cancel
                  </ButtonShad>
                </DialogClose>
                <DialogClose asChild>
                  <ButtonShad
                    onClick={handleConvertClick}
                    disabled={loading || vidUrl.length == 0}
                    className="border border-red-500 hover:bg-red-500/80"
                    variant="destructive"
                  >
                    {loading ? (
                      <div className="flex gap-2 items-center">
                        <BiLoader className="animate-spin" /> Loading...
                      </div>
                    ) : vidUrl.length == 0 ? (
                      'Empty'
                    ) : (
                      'Continue'
                    )}
                  </ButtonShad>
                </DialogClose>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Button
          className={clsx(
            correctYtUrl &&
              'bg-red-600 ring-red-400/50 hover:bg-red-500 border-red-500'
          )}
          onClick={correctYtUrl ? handleConvertClick : undefined}
          disabled={loading || vidUrl.length == 0 || !allowedToFetch}
        >
          {loading ? (
            <div className="flex gap-2 items-center">
              <BiLoader className="animate-spin" /> Loading...
            </div>
          ) : vidUrl.length == 0 ? (
            'Empty'
          ) : (
            'Convert Video'
          )}
        </Button>
      )}

      <ScaleLoader width="10" height="60" color="white" loading={loading} />

      {videoInfo && (
        <section className="flex flex-col md:flex-row justify-between w-full gap-4 py-2">
          <div className="flex flex-col gap-2 h-full">
            <div className="group aspect-video h-full lg:h-40 2xl:h-[13.5rem] relative overflow-hidden rounded-lg">
              <Image
                src={videoInfo.thumbnailUrl}
                alt="Video Thumbnail"
                fill
                className="object-cover"
              />

              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>
              <Link
                href={videoInfo.videoUrl}
                target="_blank"
                rel="norefrrer"
                className="absolute flex items-center justify-center w-full h-full duration-200 opacity-0 group-hover:opacity-100"
              >
                <FiExternalLink className="h-10 w-10" />
              </Link>
            </div>
            <div className="flex gap-2 items-center w-full">
              <div className="group w-10 h-10 relative rounded-full overflow-hidden">
                <Image
                  className="object-cover"
                  fill
                  src={videoInfo.authorThumbnailUrl}
                  alt="Author Image"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>
                <Link
                  href={videoInfo.author.channel_url}
                  target="_blank"
                  rel="norefrrer"
                  className="absolute flex items-center justify-center w-full h-full duration-200 opacity-0 group-hover:opacity-100"
                >
                  <FiExternalLink className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-col line-clamp-2">
                <h3 className="text-lg">{videoInfo.author.name}</h3>
                <div className="flex gap-4 text-sm text-highlight">
                  <p>{videoInfo.author.user}</p>
                  <p>{videoInfo.uploadDate}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-full justify-between flex-col items-center gap-2 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {videoInfo.downloadLinks.map((link, i) => (
                <Link key={i} href={link.url}>
                  <Button className="gap-2 group">
                    <div className="flex gap-2 items-center group-hover:scale-110 transition-transform">
                      <HiDownload />
                      <span className="xl:block hidden">Download</span> {link.quality}
                    </div>
                  </Button>
                </Link>
              ))}
{/*               {videoInfo.bestAudioFormat && (
                <Link href={videoInfo.bestAudioFormat.url}>
                  <Button className="gap-2 group">
                    <div className="flex gap-2 items-center group-hover:scale-110 transition-transform">
                      <HiDownload />
                      Download {videoInfo.bestAudioFormat.quality}
                    </div>
                  </Button>
                </Link>
              )} */}
              {videoInfo.audioDownloadLink && (
                <Link href={videoInfo.audioDownloadLink.url}>
                  <Button className="gap-2 group">
                    <div className="flex gap-2 items-center group-hover:scale-110 transition-transform">
                      <HiDownload />
                      <span className="xl:block hidden">Download</span>{' '}
                      Audio
                    </div>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {videoInfo && <hr className="border-border w-full" />}

      <div className="flex justify-center items-center gap-4">
        <SocialLink link="/converters/tiktok" icon={SiTiktok} iconSize={64} />
        {/*  <SocialLink link="/converters/rumble">
            <Image width={36} height={36} src={RumbleIcon} alt="Rumble Icon"/>
          </SocialLink> */}
        <SocialLink
          iconSize={36}
          icon={BsMusicNote}
          link="/converters/ytmp3"
        ></SocialLink>
      </div>
    </div>
  );
}

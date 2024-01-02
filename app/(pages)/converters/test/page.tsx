'use client';
import { useState } from 'react';
import Input from '@/components/Converter/Input';
import Button from '@/components/UI Elements/Button';
import { message } from 'antd';
import { isYoutubeUrl } from '@/utils/converter/YtParser';
import clsx from 'clsx';
import { BiLoader } from 'react-icons/bi';
import {ScaleLoader} from 'react-spinners'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ButtonShad } from '@/components/ui/buttonshad';
import { DialogClose } from '@radix-ui/react-dialog';

interface VideoInfo {
  downloadLinks: string[];
  thumbnailUrl: string;
  videoUrl: string;
  author: Record<string, string>
  authorThumbnailUrl: string;
  uploadDate: Date;
  lengthSeconds: number;
}

export default function TestConverterPage() {
  const [vidUrl, setVidUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo>();

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

        console.log(data.info)
      } else {
        const errorMessage = await response.text();
        console.error('Error fetching video information:', errorMessage);
        message.error(errorMessage)
      }
    } catch (error) {
      console.error('Error fetching video information:', error);
    } finally {
      setLoading(false);
    }
  };

  const correctYtUrl = isYoutubeUrl(vidUrl)

  return (
    <div className="min-h-screen p-8 gap-4 flex flex-col items-center justify-center max-w-6xl w-full mx-auto">
      <div className='text-center space-y-2'>
        <h1 className="text-4xl font-semibold"><span className='text-red-600'>YouTube</span> MP4 Converter</h1>
        <p className='text-[--highlight] font-light'>Paste the url of the YouTube video you want to download, then select which quality and download!</p>
      </div>

      <Input
          type="text"
          placeholder="Enter YouTube video URL"
          value={vidUrl}
          disabled={loading}
          onChange={(e) => setVidUrl(e.target.value)}
      />

      {!correctYtUrl ? 
            <Dialog>
            <DialogTrigger asChild>
            <Button className={clsx(correctYtUrl && 'bg-red-600 hover:bg-red-500 border-red-500')} onClick={correctYtUrl ? handleConvertClick : undefined} disabled={loading || vidUrl.length == 0}>
            {loading ? <div className='flex gap-2 items-center'><BiLoader className="animate-spin"/> Loading...</div> : 'Convert Video'}
            </Button>
            </DialogTrigger>
            <DialogContent>
              <div className='flex flex-col gap-2 p-8 items-center justify-center text-center'>
                <h1 className='text-2xl font-semibold'>Confirmation</h1>
                <p className='opacity-80 font-light'>This URL doesn&apos;t appear to be a valid YouTube video link. Are you sure you want to proceed with the conversion?</p>
                <div className='flex gap-2 mt-2'>
                  <DialogClose asChild>
                    <ButtonShad className='bg-white hover:bg-white/80 text-black border border-white'>Cancel</ButtonShad>
                  </DialogClose>
                  <DialogClose asChild>
                  <ButtonShad onClick={handleConvertClick} disabled={loading} className="border border-red-500 hover:bg-red-500/80" variant="destructive">{loading ? <div className='flex gap-2 items-center'><BiLoader className="animate-spin"/> Loading...</div> : 'Continue'}</ButtonShad>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
      :
      <Button className={clsx(correctYtUrl && 'bg-red-600 hover:bg-red-500 border-red-500')} onClick={correctYtUrl ? handleConvertClick : undefined} disabled={loading || vidUrl.length == 0}>
        {loading ? <div className='flex gap-2 items-center'><BiLoader className="animate-spin"/> Loading...</div> : 'Convert Video'}
      </Button>
      }


      <ScaleLoader width="10" height="60" color='white' loading={loading}/>

      {videoInfo && (
        <div className="flex flex-col gap-4">
          
        </div>
      )}
    </div>
  );
}

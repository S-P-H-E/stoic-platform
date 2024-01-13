import AIPhotoUploader from '@/components/AI/AIPhotoUploader';
import SquigglyLines from '@/components/SquigglyLines';
import image from '@/public/placeholder.jpg'

export default function ImageAIComponent() {
  return (
    <section className="lg:py-10 gap-8 lg:px-16 p-6 flex flex-col w-full min-h-screen items-center justify-center">
        <h1 className="mx-auto text-center max-w-4xl font-display text-5xl font-bold tracking-normal sm:text-7xl">
        Elevate your content with{' '}
          <span className="relative whitespace-nowrap text-[#3290EE]">
            <span className='opacity-50'><SquigglyLines /></span>
            <span className="relative">Stoic AI</span>
          </span>{' '}
          now.
        </h1>
        

        <p className='text-highlight text-lg '>Upload an image below to get started.</p>
      <AIPhotoUploader/>

    </section>
  );
}
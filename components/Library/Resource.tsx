import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Link from 'next/link';
import { HiDownload } from 'react-icons/hi'

interface ResourceProps {
  downloadLink: string | null;
  resourceName: string | null;
  resourceImage: string | StaticImport;
  onDelete: () => void;
}

export default function Resource({downloadLink, resourceName, resourceImage, onDelete}: ResourceProps) {

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  return (
    <div>
        {downloadLink ? (
          <div className="h-64 p-8 border-[--border] border rounded-lg flex flex-col items-center justify-center gap-1">
            <Image className="rounded-lg w-40 h-40" src={resourceImage} alt="Resource Image" width={500} height={0} />
            { resourceName ? 
              <p className="text-lg font-semibold">{truncateText(resourceName, 16)}</p>
            : null}
            <Link className="p-2 border border-[--border] rounded-xl hover:bg-[--border] transition flex items-center gap-1" href={downloadLink} target="_blank">
              <HiDownload />
              Download
            </Link>
          </div>
            ) : (
              <p>Loading image...</p>
            )}
    </div>
  )
}

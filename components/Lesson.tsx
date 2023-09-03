import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface LessonProps {
  name: string;
  index: number;
  link: string;
  courseId: string;
  lessonId: string;
  contentId?: string; // Make contentId optional
}

interface Content {
  duration: string;
}

export default function Lesson({
  name,
  index,
  link,
  courseId,
  lessonId,
  contentId, // contentId is now optional
}: LessonProps) {

  const lessonNumber = index + 1;
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log("Course ID: ", courseId, "Lesson ID: ", lessonId )

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        if (contentId) {
          const contentRef = doc(
            db,
            'courses',
            courseId,
            'lessons',
            lessonId,
            'content',
            contentId
          );
          const contentDoc = await getDoc(contentRef);

          console.log("Course ID: ", courseId, "Lesson ID: ", lessonId )

          if (contentDoc.exists()) {
            setContent(contentDoc.data() as Content);
          } else {
            setError('Content not found');
          }
        } else {
          // Handle case when contentId is not provided
          setError('Content ID not provided');
        }
      } catch (error) {
        console.error('Error fetching content data:', error);
        setError('Error fetching content data');
      } finally {
        setLoading(false);
      }
    };

    fetchContentData();
  }, [courseId, lessonId, contentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLesson = () => {
    window.location.href = link;
  };
  return (
    <>
        {/* <button
            data-tf-popup={link}
            data-tf-opacity="100"
            data-tf-hide-headers
            data-tf-size="100"
            data-tf-auto-close
            data-tf-transitive-search-params
            data-tf-medium="snippet"
        >
            <div className="bg-[#262626] px-5 py-5 rounded-2xl flex justify-start items-center gap-3 cursor-pointer" >
                <p className="text-[#5e5e5e]">{lessonNumber}</p>
                <div className='bg-[#F9C602] text-black p-2 rounded-full'>
                <FaGraduationCap size={20}/>
                </div>
                <div className='flex justify-between items-center w-full'>
                <h1 className='text-[#aaaaaa] text-2xl'>{name}</h1>
                <h1 className='text-[#5e5e5e]'>{duration}</h1>
                </div>
            </div>
        </button>
        <Script src="//embed.typeform.com/next/embed.js" /> */}

          <div className="bg-[#252525] px-5 py-5 rounded-2xl flex justify-start items-center gap-3 cursor-pointer" >
            <p className="text-[#5e5e5e]">{lessonNumber}</p>
            <div className='bg-[#525152] p-2 rounded-full'>
            </div>
            <div className='flex justify-between items-center w-full'>
            <h1 className='text-[#aaaaaa] text-2xl'>{name}</h1>
            <h1 className='text-[#5e5e5e]'>Locked</h1>
            </div>
          </div>
    </>
  );
}

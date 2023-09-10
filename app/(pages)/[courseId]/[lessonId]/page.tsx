"use client"
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { BsChevronLeft } from 'react-icons/bs'
import Link from 'next/link';
import Search from '@/components/Search/page';
import Script from 'next/script';
import Comments from '@/components/Comments';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import {motion} from 'framer-motion'
import { BiCopy } from 'react-icons/bi'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import CreateCourse from '@/components/CreateCourse/page';
import { message } from 'antd';


interface LessonItem {
  id: string;
  title: string;
  description: string;
  order: number;
}

export default function LessonPage() {
  const router = useRouter();
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState<any | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);

  const {user, userId, userStatus } = UserDataFetcher()
  
  const pathname = usePathname();

  const lessonpath = useParams()

  const fadeInAnimationVariants = { // for framer motion  
    initial: {
        opacity: 0,
        y: 100,
    },
    animate: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.05 * index,
        }
    })
}
 
/*   console.log("lastLesson" + userLastLesson) */
  const deleteLesson = async () => {
    try {
      if (lessonId) {
        const lessonDocRef = doc(db, 'courses', courseId as string, 'lessons', lessonId as string);
        await deleteDoc(lessonDocRef);
      }
    } catch(error) {
      console.log(error)
    }
  }

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        if (courseId && lessonId && userId) {
          const lessonDocRef = doc(db, 'courses', courseId as string, 'lessons', lessonId as string);
          const lessonDocSnap = await getDoc(lessonDocRef);
          const userCourseRef = doc(db, 'users', String(userId), 'courses', String(courseId));
          setDoc(userCourseRef, { lastLessonId: lessonId }, { merge: true })

          const userRef = doc(db, 'users', userId)
          updateDoc(userRef, {
            generalLastCourse: courseId,
            generalLastLesson: lessonId,
          });

          if (lessonDocSnap.exists()) {
            const lessonData = lessonDocSnap.data();
            setLesson(lessonData);
          } else {
            const firstLessonQuery = query(
              collection(db, 'courses', courseId as string, 'lessons'),
              orderBy('order'), // Assuming 'order' is the field to order lessons by
              limit(1) // Limit to the first lesson
            );
    
            const firstLessonSnapshot = await getDocs(firstLessonQuery);
            if (!firstLessonSnapshot.empty) {
              const firstLessonData = firstLessonSnapshot.docs[0].data();
              const firstLessonId = firstLessonSnapshot.docs[0].id;
              
              router.push(`/${courseId}/${firstLessonId}`);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching lesson:' + error);
      }
    };

    const fetchLessonsForCourse = () => {
      try {
        if (courseId) {
          const lessonsRef = collection(db, 'courses', courseId as string, 'lessons');
          const q = query(lessonsRef);
    
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const lessonsData: LessonItem[] = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              title: doc.data().title,
              description: doc.data().description,
              order: doc.data().order,
            }));
            lessonsData.sort((a, b) => a.order - b.order);
    
            setLessons(lessonsData);
          });
    
          return () => unsubscribe(); // Unsubscribe when the component unmounts
        } else {
          console.log('Course Id not found');
        }
      } catch (error) {
        console.error('Error fetching lessons:' + error);
      }
    };

    fetchLessonData();
    fetchLessonsForCourse();
    
  }, [courseId, lessonId, userId, router]);

  if (!lesson || !lessons) {
    return (
      <>
        <div className='flex flex-col justify-center items-center'>
      <div className="px-10 pt-10 flex justify-between items-center gap-6 w-full">
        <Link href={'/dashboard'} className=" mb-4 cursor-pointer flex gap-1 items-center text-[--highlight] hover:text-stone-200 transition md:gap:2">
            <BsChevronLeft/>
            <h1 className="text-lg">Go back</h1>
        </Link>
       <div className='flex gap-3 items-center'>

        <Search />
       </div>
      </div>

      <div className="flex flex-col md:flex-row p-10">
        <div className=''>
            <>
              <div className=' md:w-[1024px] bg-[#252525] rounded-3xl shadow-2xl animate-pulse aspect-video' />

              <div className='my-5 md:mb-20 rounded-2xl p-5'>
                <div className='h-[25px] w-[150px] bg-[#252525] rounded-lg mb-2'/>
                <div className='h-[20px] md:w-[400px] bg-[#252525] rounded-lg'></div>
              </div>
              
              <div className='hidden md:block'>
                <Comments courseId={courseId as string} lessonId={lessonId as string}/>
              </div>
            </>
        </div>

        <div>
          <div className='flex flex-col justify-center items-center gap-5'>
              <div className='mx-5 rounded-2xl bg-[#252525] h-[80px] w-full md:w-[300px]'/>
            <div className='visible md:hidden'>
                <Comments courseId={courseId as string} lessonId={lessonId as string}/>
            </div>
          </div>
        </div>
      </div>
    </div>
      </>
    );
  }

  const handleLinkCopy = () => {
    const currentUrl = 'https://app.stoiccord.com'+pathname
    navigator.clipboard.writeText(currentUrl);
    message.success('Copied to clipboard');
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className="px-10 pt-10 flex justify-between items-center gap-6 w-full">
        <Link href={'/dashboard'} className=" mb-4 cursor-pointer flex gap-1 items-center text-[--highlight] hover:text-stone-200 transition md:gap:2">
            <BsChevronLeft/>
            <h1 className="text-lg">Go back</h1>
        </Link>
       <div className='flex gap-3 items-center'>
        <Search />
       </div>
      </div>

      <div className="flex flex-col md:flex-row p-5 md:p-10">
        <div>
            <>
              <div className=' md:w-[1024px] rounded-3xl shadow-2xl shadow-white/10 aspect-video'>
                <iframe
                  src={lesson.url}
                  allow="autoplay; fullscreen; picture-in-picture"
                  style={{ width: '100%', height: '100%', borderRadius: '24px' }}
                  /* title="AE - Episode 1" */
                />
              </div>
              <Script src="https://player.vimeo.com/api/player.js" />

              <div className='my-5 md:mb-20 border border-[--border] rounded-2xl p-5'>
                <div className='flex flex-col md:flex-row justify-between'>
                  <button className='border border-[--border] flex w-fit md:hidden gap-1 h-fit items-center rounded-xl mb-5 px-2' onClick={handleLinkCopy}>
                    <BiCopy />
                    Copy
                  </button>
                  <h1 className='text-3xl font-medium'>
                  {truncateText(lesson.title, 40)}
                  </h1>
                  <button className='hidden border border-[--border] md:flex gap-1 h-fit items-center rounded-xl px-2' onClick={handleLinkCopy}>
                    <BiCopy />
                    Copy
                  </button>
                </div>
                <p className='rounded-xl mt-3 max-w-[950px]'>{lesson.description}</p>
              </div>
              
              <div className='hidden md:block'>
                <Comments courseId={courseId as string} lessonId={lessonId as string}/>
              </div>
            </>
        </div>

        <div>
          <div className='flex flex-col gap-5'>
          {lessons.map((lessonItem, index) => (
            <motion.div key={index}
            custom={index}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            whileHover={{
              scale: 1.08
            }}
            whileTap={{
              scale: 1
            }}
            >
            <Link href={`/${courseId}/${lessonItem.id}`} key={index} className='cursor-pointer w-full'>
                <ContextMenu>
                  <ContextMenuTrigger>
                  <div className={` w-full md:w-[300px] md:mx-5 px-3 py-3 rounded-2xl transition-all bg-[--bg] border border-[--border] group cursor-pointer flex justify-start items-center gap-2 ${String(lessonpath.lessonId) === String(lessonItem.id) ? 'invert' : ''}`}>
                    <p className='text-3xl font-mono rounded-full p-2 px-4'>{lessonItem.order as unknown as string}</p>
                    <h1 className='text-xl font-medium text-white'>
                      {truncateText(lessonItem.title, 14)}
                    </h1>
                  </div>
                  </ContextMenuTrigger>
                
                {userStatus == 'admin' &&
                  <ContextMenuContent className="w-64">
                    <ContextMenuCheckboxItem className="cursor-pointer" onClick={deleteLesson}>
                      Delete
                    </ContextMenuCheckboxItem>
                  </ContextMenuContent>
                }
                </ContextMenu>
            </Link>
            </motion.div>
            ))}
            <div className='visible md:hidden'>
                <Comments courseId={courseId as string} lessonId={lessonId as string}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

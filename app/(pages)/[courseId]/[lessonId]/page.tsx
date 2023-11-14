"use client"
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, increment, limit, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import Script from 'next/script';
import Comments from '@/components/Course/Comments';
import { UserDataFetcher } from '@/utils/userDataFetcher';
import {motion} from 'framer-motion'
import { BiCopy } from 'react-icons/bi'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { message } from 'antd';
import VimeoPlayer from '@vimeo/player';
import clsx from 'clsx';
import { FaCheckCircle, FaEyeSlash, FaTimesCircle } from 'react-icons/fa';
import { AiOutlineCloseCircle, AiFillCheckCircle, AiFillPlusCircle } from 'react-icons/ai';
import SkeletonLesson from '../../../../components/Course/SkeletonLesson';
import GoBack from '@/components/UI Elements/GoBack';
import { BsChevronLeft } from 'react-icons/bs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import Lesson from '@/components/Course/Create/Lesson';


interface LessonItem {
  id: string;
  title: string;
  description: string;
  order: number;
  url: string;
}

export default function LessonPage() {
  const router = useRouter();
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState<any | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [copied, setCopied] = useState<boolean>(false)
  const [vimeoUrl, setVimeoUrl] = useState<string>("")
  const [courseName, setCourseName] = useState('');
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [userCompleted ,setUserCompleted] = useState<boolean>(false)
  const [lessonCompletionStatusMap, setLessonCompletionStatusMap] = useState(new Map());
  const [completedLessonCount, setCompletedLessonCount] = useState(null);

  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [lessonCompletionFlag, setLessonCompletionFlag] = useState(false);

  
  const { userId, userStatus } = UserDataFetcher()
  const isPremium = userStatus === 'premium' || userStatus === 'admin'
  
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
  const deleteLesson = async (lessonIdToDelete: string) => {
    try {
      if (lessonIdToDelete) {
        const lessonDocRef = doc(db, 'courses', courseId as string, 'lessons', lessonIdToDelete);
        await deleteDoc(lessonDocRef);
      }
    } catch (error) {
      console.log(error);
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
        if (courseId && lessonId && userId && isPremium) {
          const lessonDocRef = doc(db, 'courses', courseId as string, 'lessons', lessonId as string);
          const lessonDocSnap = await getDoc(lessonDocRef);
          const userCourseRef = doc(db, 'users', String(userId), 'courses', String(courseId));
          setDoc(userCourseRef, { lastLessonId: lessonId }, { merge: true })

          const courseDocRef = doc(db, 'courses', courseId as string);
          const courseDocSnap = await getDoc(courseDocRef);
          
          if (courseDocSnap.exists()) {
            const courseData = courseDocSnap.data();
            const courseName = courseData.name;

            setCourseName(courseName)
          }

          const userRef = doc(db, 'users', userId)
          updateDoc(userRef, {
            generalLastCourse: courseId,
            generalLastLesson: lessonId,
          });

          if (lessonDocSnap.exists()) {
            const lessonData = lessonDocSnap.data();
            setLesson(lessonData);

            const userCourseLessonsRef = collection(
              db,
              'users',
              String(userId),
              'courses',
              String(courseId),
              'lessons'
            );

            const lessonIdStr = String(lessonId);
            await setDoc(
              doc(userCourseLessonsRef, lessonIdStr),
              { watched: true },
              { merge: true }
            );

          } else {
            const firstLessonQuery = query(
              collection(db, 'courses', courseId as string, 'lessons'),
              orderBy('order'),
              limit(1)
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
              url: doc.data().url
            }));
            lessonsData.sort((a, b) => a.order - b.order);

            setLessons(lessonsData);

            if (lessonsData.length > 0) {
              setVimeoUrl(lessonsData[0].url);
            }
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
    
  }, [courseId, lessonId, userId, router, vimeoUrl, isPremium]);

  
  useEffect(() => {
    const CompleteLesson = async () => {
      try {
        const lessonCompletionRef = doc(
          db,
          'users',
          String(userId),
          'courses',
          String(courseId),
          'lessons',
          String(lessonId)
        );

        const lessonCompletionSnapshot = await getDoc(lessonCompletionRef);
        const isCompleted = lessonCompletionSnapshot.data()?.completed === true;

        if(!isCompleted) {
          const userCourseLessonsRef = collection(
            db,
            'users',
            String(userId),
            'courses',
            String(courseId),
            'lessons'
          );
  
          const userCourseRef = doc(
            db,
            'users',
            String(userId),
            'courses',
            String(courseId),
          );
  
          await setDoc(
            doc(userCourseLessonsRef, String(lessonId)),
            { completed: true },
            { merge: true }
          );
  
          await updateDoc(userCourseRef, {
            completedLessonCount: increment(1),
          });
        }
      } catch (error) {
        
      }
    }

    const handleVimeoMessageAsync = async (event: MessageEvent) => {
      if (event.origin === 'https://player.vimeo.com' && userId && isPremium) {
        var iframe = document.querySelector('iframe');
        var player = new VimeoPlayer(iframe);

        player.on('play', function(){
          setVideoPlaying(true)
          console.log("VIDEO PLAYED")
        })

        player.on('pause', function(){
          setVideoPlaying(false)
          console.log("VIDEO PAUSED")
        })

        let completedFlag = false
        player.on('ended', async function() {
        if (!completedFlag) {
          completedFlag = true; // Set the flag to true
          if (!lessonCompletionFlag) {
            setLessonCompletionFlag(true); // Set the flag to true to mark completion
            CompleteLesson();
          }
        }
        });
      }
    };
  
  
    if (vimeoUrl) {
      window.addEventListener('message', handleVimeoMessageAsync);
  
      // Remove the event listener when the component unmounts
      return () => {
        window.removeEventListener('message', handleVimeoMessageAsync);
      };
    }
  }, [vimeoUrl, userId, courseId, lessonId, isPremium, lessonCompleted, lessonCompletionFlag]);

  useEffect(() => {
    const fetchUserCompletion = () => {
      try {
        if (userId && courseId && lessonId && isPremium) {
          // Create a reference to the specific lesson's completion status in Firestore
          const lessonCompletionRef = doc(
            db,
            'users',
            String(userId),
            'courses',
            String(courseId),
            'lessons',
            String(lessonId)
          );
  
          // Create a real-time listener for the document
          const unsubscribe = onSnapshot(lessonCompletionRef, (snapshot) => {
            if (snapshot.exists()) {
              const completed = snapshot.data()?.completed;
  
              if (completed === true) {
                setUserCompleted(true);
              } else {
                setUserCompleted(false);
              }
            } else {
              setUserCompleted(false);
            }
          });
  
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching user completion:', error);
      }
    };
  
    fetchUserCompletion();
  }, [userId, courseId, lessonId, isPremium]);
  
  useEffect(() => {
    const userCompletedLessonsRef = doc(
      db, 'users', String(userId), 'courses', String(courseId)
    );

    const unsubscribe = onSnapshot(userCompletedLessonsRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setCompletedLessonCount(data.completedLessonCount);
      } else {
        setCompletedLessonCount(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userId, courseId]);

  useEffect(() => {
    const fetchLessonCompletionStatus = async () => {
      try {
        if (userId && courseId && isPremium) {
          const userCourseLessonsRef = collection(
            db,
            'users',
            String(userId),
            'courses',
            String(courseId),
            'lessons'
          );
  
          const unsubscribe = onSnapshot(userCourseLessonsRef, (querySnapshot) => {
            const lessonCompletionStatusMap = new Map<string, boolean>();
            
            querySnapshot.forEach((docSnapshot) => {
              const lessonId = docSnapshot.id;
              const completed = docSnapshot.data()?.completed || false;
              lessonCompletionStatusMap.set(lessonId, completed);
            });
  
            setLessonCompletionStatusMap(lessonCompletionStatusMap);
  
            // Update the completion status of each lesson based on the snapshot data
            setLessons((prevLessons) => {
              return prevLessons.map((lessonItem) => ({
                ...lessonItem,
                completed: lessonCompletionStatusMap.get(lessonItem.id) || false,
              }));
            });
          });
  
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching lesson completion status:', error);
      }
    };
  
    fetchLessonCompletionStatus();
  }, [userId, courseId, isPremium]);
  

  if (!lesson || !lessons) {
    return (
      <>
      <div className='flex flex-col justify-center items-center w-full'>
      <div className="lg:p-10 lg:px-16 p-6 pt-10 flex justify-between items-center gap-6 w-full">
        <GoBack/>
       <div className='flex gap-3 items-center'>
       </div>
      </div>

      <div className="flex flex-col lg:p-10 lg:px-16 p-6 w-full h-screen">
        <div>
          <SkeletonLesson/>
        </div>
      </div>
    </div>
      </>
    );
  }

  const handleLinkCopy = () => {
    const currentUrl = 'https://app.stoiccord.com'+pathname
    navigator.clipboard.writeText(currentUrl);
    message.success('Link copied to clipboard');
    setCopied(true)

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <div className='flex flex-col w-full gap-4 lg:p-10 lg:px-16 p-6'>
      <div className="flex justify-between items-center gap-6 w-full">
      <Link href={'/courses'} className="text-[#D5d6d6] text-lg hover:text-stone-200 transition gap-1 flex items-center"><BsChevronLeft/>Go Back</Link>
      </div>

      <h1 className="text-3xl font-medium">{courseName} - Episode {lesson.order}</h1>

      <div className="flex flex-col md:flex-row w-full">
        <div className='w-full'>
            <>
              <div className='sm:w-full rounded-3xl shadow-2xl shadow-white/10 aspect-video'>
                <iframe
                  src={lesson.url}
                  allow="autoplay; fullscreen; picture-in-picture"
                  style={{ width: '100%', height: '100%', borderRadius: '24px' }}
                />
              </div>
              <Script src="https://player.vimeo.com/api/player.js" />

              <div className='my-5 border border-[--border] rounded-2xl p-5 relative'>
                <div className='flex flex-col md:flex-row justify-between'>
                  <button className='border border-[--border] flex w-fit md:hidden gap-1 h-fit items-center rounded-xl mb-5 px-2' onClick={handleLinkCopy}>
                    <BiCopy />
                    {copied ? 
                    <p>Copied!</p>
                    : <p>Copy</p>
                    }
                  </button>
                  <h1 className='text-3xl font-medium'>
                    {truncateText(lesson.title, 40)}
                  </h1>
                  <div className='flex justify-between items-center gap-2'>
                    <button className='hidden border border-[--border] md:flex gap-1 h-fit items-center rounded-xl px-2' onClick={handleLinkCopy}>
                      <BiCopy />
                      {copied ? 
                      <p>Copied!</p>
                      : <p>Copy</p>
                      }
                    </button>
                    <div className='md:static absolute right-6 top-6'>
                    {userCompleted === true ? (
                          <AiFillCheckCircle className="text-green-500"/>
                        ) : ( 
                          <AiOutlineCloseCircle className="text-red-500" />
                    )}
                    </div>
                  </div>
                  
                </div>
                <p className='rounded-xl mt-3 max-w-[950px] text-sm md:text-base'>{lesson.description}</p>
              </div>
              
              <div className='hidden md:block'>
                <Comments courseId={courseId as string} lessonId={lessonId as string}/>
              </div>
            </>
        </div>

        <div>

        {/* DESKTOP LESSON LIST */}

        <div className="hidden md:flex flex-col gap-5 md:mx-5">
          {lessons.map((lessonItem, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={fadeInAnimationVariants}
              initial="initial"
              whileInView="animate"
              viewport={{
                once: true,
              }}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 1,
              }}
            >
            <Link href={`/${courseId}/${lessonItem.id}`} key={index} className='cursor-pointer w-full'>
                <ContextMenu>
                  <ContextMenuTrigger>
                  <div className={`hover:bg-[--border] w-full lg:w-[250px] 2xl:w-[300px] p-3 rounded-2xl transition-all bg-[--bg] border border-[--border] group cursor-pointer flex justify-between items-center gap-2 
                  ${String(lessonpath.lessonId) === String(lessonItem.id) ? 'bg-white text-black hover:bg-neutral-200' : ''}
                  ${videoPlaying && String(lessonpath.lessonId) === String(lessonItem.id) ? 'animate-pulse' : ''}`}>
                    <div className="flex items-center">
                      <p className='text-3xl font-mono rounded-full p-2 px-4'>{lessonItem.order as unknown as string}</p>
                      <h1 className={clsx('text-xl font-medium', {
                        'text-black': String(lessonpath.lessonId) === String(lessonItem.id),
                        'hidden md:flex': true,
                      })}>
                        {truncateText(lessonItem.title, 14)}
                      </h1>
                      <h1 className={clsx('text-xl font-medium', {
                        'text-black': String(lessonpath.lessonId) === String(lessonItem.id),
                        'md:hidden flex': true,
                      })}>
                        {truncateText(lessonItem.title, 29)}
                      </h1>
                    </div>
                    {lessonCompletionStatusMap.has(lessonItem.id) ? (
                      lessonCompletionStatusMap.get(lessonItem.id) ? (
                        <>
                          <FaCheckCircle className="text-green-500" />
                        </>
                      ) : (
                        <>
                        <FaTimesCircle className="text-red-500" />
                        </>
                      )
                    ) : (
                      <>
                        <FaEyeSlash className="text-gray-500" />
                      </>
                    )}
                  </div>
                  </ContextMenuTrigger>
                
                {userStatus == 'admin' &&
                  <ContextMenuContent className="w-64">
                    <ContextMenuCheckboxItem className="cursor-pointer" onClick={() => deleteLesson(lessonItem.id)}>
                      Delete
                    </ContextMenuCheckboxItem>
                  </ContextMenuContent>
                }
                </ContextMenu>
            </Link>
            </motion.div>
            ))}
            {userStatus == 'admin' && userId && (
                <Dialog>
                  <DialogTrigger>
                    <motion.div
                      className="hover:bg-[--border] h-20 w-full lg:w-[250px] 2xl:w-[300px] text-xl rounded-2xl transition-all bg-[--bg] !border-2 border-dotted 
                      border-[--border] group cursor-pointer flex justify-center items-center gap-2 text-center"
                      initial={{opacity: 0 }}
                      animate={{opacity: 1}}
                      transition={{delay: 0.35}}
                      >
                      <span className='group-hover:scale-x-110 transition flex gap-2 items-center'>
                        <AiFillPlusCircle/>
                        <p>Add a lesson</p>
                      </span>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent>
                    <Lesson predefinedCourse={courseId} predefinedCourseName={courseName}/>
                </DialogContent>
              </Dialog>
            )}
        </div>
        
        {/* MOBILE LESSON LIST */}

        <div className="visible md:hidden max-h-[300px] overflow-y-scroll flex flex-col overflow-x-hidden gap-3 relative">
          {lessons.map((lessonItem, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={fadeInAnimationVariants}
              initial="initial"
              whileInView="animate"
              viewport={{
                once: true,
              }}
            >
            <Link href={`/${courseId}/${lessonItem.id}`} key={index} className='cursor-pointer w-full'>
                <ContextMenu>
                  <ContextMenuTrigger>
                  <div className={`hover:bg-[--border] w-full md:w-[200px] xl:w-[250px] 2xl:w-[300px] md:mx-5 p-3 rounded-2xl transition-all bg-[--bg] border border-[--border] group cursor-pointer flex justify-between items-center gap-2 
                  ${String(lessonpath.lessonId) === String(lessonItem.id) ? 'bg-white text-black hover:bg-neutral-200' : ''}
                  ${videoPlaying && String(lessonpath.lessonId) === String(lessonItem.id) ? 'animate-pulse' : ''}`}>
                    <div className="flex items-center">
                      <p className='text-3xl font-mono rounded-full p-2 px-4'>{lessonItem.order as unknown as string}</p>
                      <h1 className={clsx('text-xl font-medium', {
                        'text-black': String(lessonpath.lessonId) === String(lessonItem.id),
                        'hidden md:flex': true,
                      })}>
                        {truncateText(lessonItem.title, 14)}
                      </h1>
                      <h1 className={clsx('text-xl font-medium', {
                        'text-black': String(lessonpath.lessonId) === String(lessonItem.id),
                        'md:hidden flex': true,
                      })}>
                        {truncateText(lessonItem.title, 29)}
                      </h1>
                    </div>
                    {lessonCompletionStatusMap.has(lessonItem.id) ? (
                      lessonCompletionStatusMap.get(lessonItem.id) ? (
                        <>
                          <FaCheckCircle className="text-green-500" />
                        </>
                      ) : (
                        <>
                        <FaTimesCircle className="text-red-500" />
                        </>
                      )
                    ) : (
                      <>
                        <FaEyeSlash className="text-gray-500" />
                      </>
                    )}
                  </div>
                  </ContextMenuTrigger>
                
                {userStatus == 'admin' &&
                  <ContextMenuContent className="w-64">
                    <ContextMenuCheckboxItem className="cursor-pointer" onClick={() => deleteLesson(lessonItem.id)}>
                      Delete
                    </ContextMenuCheckboxItem>
                  </ContextMenuContent>
                }
                </ContextMenu>
            </Link>
            </motion.div>
            ))}
            {userStatus == 'admin' && userId && (
                <Dialog>
                  <DialogTrigger>
                    <motion.div
                      className="hover:bg-[--border] h-20 w-full lg:w-[250px] 2xl:w-[300px] text-xl rounded-2xl transition-all bg-[--bg] !border-2 border-dotted 
                      border-[--border] group cursor-pointer flex justify-center items-center gap-2 text-center"
                      initial={{opacity: 0 }}
                      animate={{opacity: 1}}
                      transition={{delay: 0.4}}
                      >
                      <span className='group-hover:scale-x-110 transition flex gap-2 items-center'>
                        <AiFillPlusCircle/>
                        <p>Add a lesson</p>
                      </span>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent>
                    <Lesson predefinedCourse={courseId} predefinedCourseName={courseName}/>
                </DialogContent>
              </Dialog>
            )}
            </div>
            <div className='visible md:hidden'>
              <Comments courseId={courseId as string} lessonId={lessonId as string}/>
            </div>
        </div>
      </div>
    </div>
  );
}

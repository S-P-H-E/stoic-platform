'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import Script from 'next/script';
import Comments from '@/components/Course/Comments';
import { motion } from 'framer-motion';
import { BiCopy } from 'react-icons/bi';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { message } from 'antd';
import VimeoPlayer from '@vimeo/player';
import clsx from 'clsx';
import { FaCheckCircle, FaEyeSlash, FaTimesCircle } from 'react-icons/fa';
import {
  AiOutlineCloseCircle,
  AiFillCheckCircle,
  AiFillPlusCircle,
} from 'react-icons/ai';
import GoBack from '@/components/UI Elements/GoBack';
import { BsChevronLeft } from 'react-icons/bs';
import { IoMdCreate } from 'react-icons/io';
import SkeletonLesson from '@/components/Course/SkeletonLesson';
import ShinyButton from '@/components/ShinyButton';
import { ButtonShad } from '@/components/ui/buttonshad';
import Lottie from 'lottie-react';
import checkmarkAnimation from '@/public/lottie/checkmarkAnimation.json';
import { isUserAllowedToFetch } from '@/utils/utils';
import Unauthorized from './../../../../../components/Unauthorized';
import {UserDataFetcher} from "@/utils/userDataFetcher";

interface LessonItem {
  id: string;
  title: string;
  description: string;
  order: number;
  url: string;
  thumbnail: string;
  locked: boolean;
}

export default function LessonComponent({
  lessonId,
  courseId,
  page
}: {
  lessonId: string;
  courseId: string;
  page: number;
}) {
  const router = useRouter();
  const [lesson, setLesson] = useState<any | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [vimeoUrl, setVimeoUrl] = useState<string>('');
  const [courseName, setCourseName] = useState('');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [userCompleted, setUserCompleted] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(false);
  const [locked, setLocked] = useState(false)
  const [lessonCompletionStatusMap, setLessonCompletionStatusMap] = useState(
    new Map()
  );
  const [completedLessonCount, setCompletedLessonCount] = useState(null);
  
  const { userStatus, userId } = UserDataFetcher();
  const isPremium = isUserAllowedToFetch(userStatus);


  const fadeInAnimationVariants = {
    // for framer motion
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.045 * index,
      },
    }),
  };

  const deleteLesson = async (lessonIdToDelete: string) => {
    try {
      if (lessonIdToDelete && userStatus === 'admin') {
        const lessonDocRef = doc(
          db,
          'courses',
          courseId as string,
          'lessons',
          lessonIdToDelete
        );
        await deleteDoc(lessonDocRef);
      }
    } catch (error) {
      /*console.log(error);*/
    }
  };

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        if (courseId && lessonId && userId && isPremium) {
          const courseDocRef = doc(db, 'courses', courseId as string);
          const courseDocSnap = await getDoc(courseDocRef);

          if (courseDocSnap.exists()) {
            const courseData = courseDocSnap.data();
            const courseName = courseData.name;

            setCourseName(courseName);

            if (courseData.locked) {
              message.error('This course is locked.');
              setLocked(true)
              return;
            }

            const lessonDocRef = doc(
              db,
              'courses',
              courseId as string,
              'lessons',
              lessonId as string
            );
            const lessonDocSnap = await getDoc(lessonDocRef);
            const userCourseRef = doc(
              db,
              'users',
              String(userId),
              'courses',
              String(courseId)
            );
            setDoc(userCourseRef, { lastLessonId: lessonId }, { merge: true });
  
            const userRef = doc(db, 'users', userId);
            updateDoc(userRef, {
              generalLastCourse: courseId,
              generalLastLesson: lessonId,
            });
  
            if (lessonDocSnap.exists()) {
              const lessonData = lessonDocSnap.data();
              
              if (!lessonData.locked) {
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
                
              }
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
  
                router.push(`/courses/${courseId}/${firstLessonId}`);
              }
            }
          } 
        }
      } catch (error) {
        console.error('Error fetching lesson:' + error);
      }
    };

    const fetchLessonsForCourse = () => {
      try {
        if (courseId && isPremium) {
          const lessonsRef = collection(
            db,
            'courses',
            courseId as string,
            'lessons'
          );
          const q = query(lessonsRef);

          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const lessonsData: LessonItem[] = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              title: doc.data().title,
              description: doc.data().description,
              order: doc.data().order,
              url: doc.data().url,
              thumbnail: doc.data().thumbnail,
              locked: doc.data().locked,
            }));
            lessonsData.sort((a, b) => a.order - b.order);

            setLessons(lessonsData);

            if (lessonsData.length > 0) {
              setVimeoUrl(lessonsData[0].url);
            }
          });

          return () => unsubscribe(); // Unsubscribe when the component unmounts
        } else {
          /*console.log('Course Id not found');*/
        }
      } catch (error) {
        console.error('Error fetching lessons:' + error);
      }
    };

    fetchLessonData();
    fetchLessonsForCourse();
  }, [courseId, lessonId, userId, router, vimeoUrl, isPremium]);

  useEffect(() => {
    const CompleteVideoLesson = async () => {
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

        if (!isCompleted) {
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
            String(courseId)
          );

          const activitiesRef = collection(
            db,
            'users',
            String(userId),
            'activities'
          );

          if (lesson.title) {
            const lessonDocRef = doc(
              activitiesRef,
              `completed_${lesson.title}_lesson`
            );

            await setDoc(lessonDocRef, {
              title: `Completed '${lesson.title}' Lesson`,
              completedAt: new Date(),
              icon: 'CheckCheck',
            });
          }

          await setDoc(
            doc(userCourseLessonsRef, String(lessonId)),
            {
              completed: true,
              // doesnt set the completed at again if it already exists
              ...(lessonCompletionSnapshot.data()?.completedAt
                ? {}
                : { completedAt: new Date() }),
            },
            { merge: true }
          );

          await updateDoc(userCourseRef, {
            completedLessonCount: increment(1),
          });
        }
      } catch (error) {}
    };

    const handleVimeoMessageAsync = async (event: MessageEvent) => {
      if (event.origin === 'https://player.vimeo.com' && userId && isPremium && lesson?.type == 'video') {
        const iframe = document.querySelector('iframe');
        const player = new VimeoPlayer(iframe);

        player.on('play', function () {
          setVideoPlaying(true);
          /*console.log('VIDEO PLAYED');*/
        });

        player.on('pause', function () {
          setVideoPlaying(false);
          /*console.log('VIDEO PAUSED');*/
        });

        player.on('ended', async function () {
          setLocalCompleted(true);
          await CompleteVideoLesson();
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
  }, [vimeoUrl, userId, courseId, lessonId, isPremium, lesson?.title, lesson?.type]);

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
      db,
      'users',
      String(userId),
      'courses',
      String(courseId)
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

          const unsubscribe = onSnapshot(
            userCourseLessonsRef,
            (querySnapshot) => {
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
                  completed:
                    lessonCompletionStatusMap.get(lessonItem.id) || false,
                }));
              });
            }
          );

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching lesson completion status:', error);
      }
    };

    fetchLessonCompletionStatus();
  }, [userId, courseId, isPremium]);

  if (locked) {
    return (
      <Unauthorized/>
    )
  }

  if ( (!lesson || !lessons) && !locked) {
    // ! change
    return (
      <div className="mx-auto max-w-8xl flex flex-col justify-center items-center w-full">
        <div className="lg:px-12 lg:pt-10 pt-6 px-6 flex justify-between items-center gap-6 w-full">
          <GoBack />
        </div>

        <div className="flex flex-col w-full gap-4 lg:p-8 lg:pl-12 p-6">
          <SkeletonLesson />
        </div>
      </div>
    );
  }

  const handleLinkCopy = () => {
    const currentUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/courses/${courseId}/${lessonId}`;
    navigator.clipboard.writeText(currentUrl);
    message.success('Link copied to clipboard');
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const getNextLessonUrl = () => {
    const currentOrder = lesson.order;
    const nextLesson = lessons.find(
      (lessonItem) => lessonItem.order === currentOrder + 1
    );

    if (nextLesson) {
      return `/courses/${courseId}/${nextLesson.id}`;
    }

    return null;
  };

  return (
    <div className="flex flex-col w-full gap-4 lg:p-10 lg:px-12 p-6 mx-auto max-w-8xl">
      <div className="flex justify-between items-center gap-6 w-full">
        <Link
          href={'/courses'}
          className="text-highlight text-lg hover:text-stone-200 active:scale-90 transition gap-1 flex items-center"
        >
          <BsChevronLeft />
          Go Back
        </Link>
      </div>

      <h1 className="text-2xl lg:text-3xl font-medium">
        {courseName} - Episode {lesson.order}
        {/*  - {completedLessonCount}  */}
      </h1>

      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full">
          <>
            {lesson.type == 'text' ?
              <div className="relative flex flex-col justify-between sm:w-full rounded-3xl aspect-video p-10">
                <div className="break-words max-w-full" dangerouslySetInnerHTML={{ __html: lesson?.content[page - 1 || 0] }} />
                {lesson?.content.length > (page ?? 1) &&
                  <Link href={`/courses/${courseId}/${lessonId}?page=${(Number(page) || 1) + 1}`}><ButtonShad className="w-fit" variant="secondary">NEXT</ButtonShad></Link>
                }

                {page > 1 &&
                  <Link href={`/courses/${courseId}/${lessonId}?page=${(Number(page)) - 1}`}><ButtonShad className="w-fit" variant="secondary">PREVIOUS</ButtonShad></Link>
                }
              </div>
            :
              <div className="relative sm:w-full rounded-3xl aspect-video shadow-2xl shadow-white/10">
              <iframe
                src={lesson.url}
                allow="autoplay; fullscreen; picture-in-picture;"
                style={{ width: '100%', height: '100%', borderRadius: '24px' }}
              />

              {localCompleted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className={clsx(
                    'z-20 rounded-3xl opacity-0 w-full flex flex-col gap-4 items-center justify-center h-full absolute inset-0 bg-black/50 transition duration-300'
                  )}
                >
                  <Lottie
                    className="w-40 h-40"
                    loop={false}
                    animationData={checkmarkAnimation}
                  />
                  <h1 className="text-xl font-medium">
                    🎉 You have completed this lesson 🎉
                  </h1>
                  <ShinyButton
                    text={`Continue to lesson ${parseInt(lesson.order) + 1}`}
                    href={getNextLessonUrl() ?? lessonId.toString()}
                  />
                  <ButtonShad
                    className="text-white"
                    variant="link"
                    onClick={() => setLocalCompleted(false)}
                  >
                    Close
                  </ButtonShad>
                </motion.div>
              )}
              <Script src="https://player.vimeo.com/api/player.js" />
            </div>
            }

            {lesson.type !== 'text' &&
            <div className="my-5 border border-border bg-darkgray rounded-2xl p-5 relative">
              <div className="flex flex-col lg:flex-row justify-between">
                <button
                  aria-label="Copy Link"
                  className="active:scale-90 hover:bg-border transition border border-border flex w-fit lg:hidden gap-1 h-fit items-center rounded-xl mb-5 px-2"
                  onClick={handleLinkCopy}
                >
                  <BiCopy />
                  {copied ? <p>Copied!</p> : <p>Copy</p>}
                </button>
                <h1 className="text-3xl font-medium line-clamp-1">
                  {lesson.title}
                </h1>
                <div className="flex justify-between items-center gap-2">
                  <button
                    className="active:scale-90 hover:bg-border transition hidden border border-border lg:flex gap-1 h-fit items-center rounded-xl px-2"
                    onClick={handleLinkCopy}
                  >
                    <BiCopy />
                    {copied ? <p>Copied!</p> : <p>Copy</p>}
                  </button>
                  <div className="lg:static absolute right-6 top-6">
                    {userCompleted === true ? (
                      <AiFillCheckCircle className="text-green-500" />
                    ) : (
                      <AiOutlineCloseCircle className="text-red-500" />
                    )}
                  </div>
                </div>
              </div>
              <p className="rounded-xl mt-3 max-w-[950px] text-sm lg:text-base">
                {lesson.description
                  .split('\n')
                  .map((line: number, index: number) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
              </p>
            </div>
            }

            <div className="hidden lg:block">
              <Comments
                courseId={courseId as string}
                lessonId={lessonId as string}
              />
            </div>
          </>
          </div>

        <div>
          {/* DESKTOP LESSON LIST */}

          <div className="hidden lg:flex flex-col gap-5 mx-5">
            {lessons.map((lessonItem, index) => (
              <motion.div
                className={clsx("flex gap-2 justify-between items-center")}
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
                <Link
                  href={
                    lessonItem.locked
                      ? `/courses/${courseId}/${lessonId.toString()}`
                      : `/courses/${courseId}/${lessonItem.id}`
                  }
                  key={index}
                  className='w-full'
                >
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <div
                        className={clsx(
                          'hover:bg-border w-full lg:w-[200px] 2xl:w-[300px] p-3 rounded-2xl transition-all bg-darkgray border border-border group cursor-pointer flex justify-between items-center gap-2',
                          {
                            'bg-white text-black hover:bg-neutral-200':
                              String(lessonId) === String(lessonItem.id),
                            'animate-pulse':
                              videoPlaying &&
                              String(lessonId) === String(lessonItem.id),
                          }
                        )}
                      >
                        <div className="flex items-center p-2 px-4 gap-4">
                          <p className={clsx("text-2xl 2xl:text-3xl font-mono rounded-full", lessonItem.locked && 'opacity-50')}>
                            {lessonItem.order as unknown as string}
                          </p>
                          <h1
                            className={clsx(
                              'text-lg 2xl:text-xl line-clamp-1 font-medium',
                              {
                                'opacity-50':
                                  lessonItem.locked
                              }
                            )}
                          >
                            {lessonItem.title}
                          </h1>
                        </div>
                        <div>
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
                      </div>
                    </ContextMenuTrigger>

                    {userStatus == 'admin' && (
                      <ContextMenuContent className="w-64">
                        <ContextMenuCheckboxItem
                          className="cursor-pointer"
                          onClick={() => deleteLesson(lessonItem.id)}
                        >
                          Delete
                        </ContextMenuCheckboxItem>
                      </ContextMenuContent>
                    )}
                  </ContextMenu>
                </Link>
                {userStatus == 'admin' && (
                  <Link href={`/create/${courseId}/${lessonItem.id}`}>
                  <button
                    className={clsx(
                      lessonId === lessonItem.id && 'text-black',
                      '2xl:pl-4 md:pr-4 hover:opacity-80 transition active:scale-90 hover:scale-125 w-fit hover:drop-shadow-md'
                      )}
                    >
                      <IoMdCreate size={20} />
                  </button>
                  </Link>
                )}
              </motion.div>
            ))}
            
            {userStatus == 'admin' && userId && (
                <Link href={`/create/lesson?courseId=${courseId}`}>
                  <motion.div
                    className="hover:bg-border h-20 w-full lg:w-[200px] 2xl:w-[300px] font-medium text-lg 2xl:text-xl rounded-2xl transition-all bg-darkgray !border-2 border-dotted 
                      border-border group cursor-pointer flex justify-center items-center gap-2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    viewport={{once:true}}
                  >
                    <span className="group-hover:scale-x-110 transition flex gap-2 items-center">
                      <AiFillPlusCircle />
                      <p>Add Lesson</p>
                    </span>
                  </motion.div>
              </Link>
            )}
          </div>

          {/* MOBILE LESSON LIST */}

          <div className="visible lg:hidden max-h-[300px] overflow-y-auto scrollbar-thin hover:scrollbar-thumb-neutral-900 scrollbar-thumb-neutral-800 scrollbar-track-neutral-600 flex flex-col overflow-x-hidden gap-3 relative">
            {lessons.map((lessonItem, index) => (
              <motion.div
                key={index}
                className="flex gap-2 items-center"
                custom={index}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{
                  once: true,
                }}
              >
                <Link
                  href={
                    lessonItem.locked
                      ? `/courses/${courseId}/${lessonId.toString()}`
                      : `/courses/${courseId}/${lessonItem.id}`
                  }
                  key={index}
                  className={'w-full'}
                >
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <div
                      className={`hover:bg-border w-full lg:w-[250px] 2xl:w-[300px] lg:mx-5 p-3 rounded-2xl transition-all bg-darkgray border border-border group cursor-pointer flex justify-between items-center gap-2 
                      ${
                        String(lessonId) === String(lessonItem.id) &&
                        'bg-white text-black hover:bg-neutral-200'
                      }
                      ${
                        videoPlaying &&
                        String(lessonId) === String(lessonItem.id) &&
                        'animate-pulse'
                      }
                      ${
                        lessonItem.locked &&
                        'opacity-50'
                      }
                      `}
                      >
                        <div className="flex items-center">
                          <p className="text-3xl font-mono rounded-full p-2 px-4">
                            {lessonItem.order as unknown as string}
                          </p>
                          <h1
                            className='line-clamp-1 text-xl font-medium'     
                          >
                            {lessonItem.title}
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

                    {userStatus == 'admin' && (
                      <ContextMenuContent className="w-64">
                        <ContextMenuCheckboxItem
                          className="cursor-pointer"
                          onClick={() => deleteLesson(lessonItem.id)}
                        >
                          Delete
                        </ContextMenuCheckboxItem>
                      </ContextMenuContent>
                    )}
                  </ContextMenu>
                </Link>
              </motion.div>
            ))}
            {userStatus == 'admin' && userId && (
              <Link href={`/create/lesson?courseId=${courseId}`}>
                  <motion.div
                    className="hover:bg-border h-20 w-full lg:w-[250px] 2xl:w-[300px] font-medium text-xl rounded-2xl transition-all bg-darkgray !border-2 border-dotted 
                      border-border group cursor-pointer flex justify-center items-center gap-2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <span className="group-hover:scale-x-110 transition flex gap-2 items-center">
                      <AiFillPlusCircle />
                      <p>Add Lesson</p>
                    </span>
                  </motion.div>
              </Link>
            )}
          </div>
          <div className="visible lg:hidden">
            <Comments
              courseId={courseId as string}
              lessonId={lessonId as string}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
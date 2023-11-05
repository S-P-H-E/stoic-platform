import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db, auth } from '@/utils/firebase';
import { MdDelete } from 'react-icons/md'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { Dropdown } from 'antd';
import UserImage from '../UserImage';
import { UserDataFetcher } from '../../utils/userDataFetcher';
import {motion} from 'framer-motion'
import UserImagePassable from '../UserImagePassable';

export default function Comments({ courseId, lessonId }: { courseId: string, lessonId: any }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  const { userName, userId, userStatus, userProfileBannerUrl } = UserDataFetcher();

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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const commentsData = await Promise.all(snapshot.docs.map(async (doc) => {
            const commentData = doc.data();
            const userProfilePic = await getUserProfilePic(commentData.userId);
            return {
              id: doc.id,
              ...commentData,
              userProfilePic: userProfilePic || '/default-profile-pic-url',
            };
          }));
          setComments(commentsData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (courseId) {
      fetchComments();
    }
  }, [courseId]);



  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim() === '') {
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not logged in');
        return;
      }

      const commentsRef = collection(db, 'comments');
      await addDoc(commentsRef, {
        courseId,
        lessonId,
        comment: newComment,
        timestamp: Timestamp.fromDate(new Date()),
        userId: userId,
        userName: userName,
        userStatus: userStatus,
        userProfilePic: user.photoURL,
        userBannerPic: userProfileBannerUrl || ''
      });

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const commentRef = doc(db, 'comments', commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const getUserProfilePic = async (userId: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return userData.profileImageUrl;
      }
    } catch (error) {
      console.error('Error fetching user profile picture:', error);
    }
    return null; // Return a default image URL or handle missing images here
  };

  const detectAndStyleLinks = (comment: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = comment.match(urlRegex);

    if (!matches) {
      return comment;
    }

    let styledComment = comment;

    matches.forEach((match) => {
      styledComment = styledComment.replace(
        match,
        `<a href="${match}" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">${match}</a>`
      );
    });

    return styledComment;
  };

  const renderDeleteButton = (commentId: string) => (
    <button
      onClick={() => handleDeleteComment(commentId)}
      className='flex justify-center items-center gap-2 bg-white p-2 rounded-md shadow-xl text-red-500 transition-all hover:bg-red-500 hover:text-white'
    >
      <MdDelete />
      <h1>Delete Comment</h1>
    </button>
  );

  // Filter comments based on currentCourse
  const filteredComments = comments.filter(comment => comment.courseId === courseId);
  

  return (
    <>
    <div className='flex flex-col gap-2'>
      <h1 className='text-lg p-4 pb-1'>
        {filteredComments.length === 1
          ? `${filteredComments.length} Comment`
          : `${filteredComments.length} Comments`}
      </h1>
      <form onSubmit={handleSubmitComment} className='flex justify-between items-center w-full gap-2 px-4'>
        {comments.length > 0 && (
          
          <div className='h-[40px] md:h-[50px] aspect-square'>
            <UserImage />
          </div>
        )}
        <input
          placeholder='Type your comment here'
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className='w-full outline-none py-3 bg-transparent text-lg border-b transition duration-200 focus:border-[--highlight] border-[--border] placeholder:text-[#b9b9b9]'
        />
        {/* <button type="submit" className='bg-[white] text-black m-1 p-4 rounded-full font-medium w-full md:w-fit'>
          <HiMiniPencilSquare size={20}/>
        </button> */}
      </form>
      <ul>
        {filteredComments.map((comment) => (
          <motion.li key={comment.id} className=' my-4 p-4 rounded-2xl'
          custom={comment.id}
          variants={fadeInAnimationVariants}
          initial="initial"
          whileInView="animate"
          viewport={{
            once: true,
          }}
          >
            <div className='flex justify-between items-center'>
              <div className='flex justify-center items-center'>
                <div className="w-10 h-10 mr-1">
                <UserImagePassable userBannerUrl={comment.userBannerPic} userImage={comment.userProfilePic} userName={comment.userName} userStatus={comment.userStatus}/>
                </div>
                {/* <Image width={500} height={500} src={comment.userProfilePic} alt="Profile Picture" className='w-10 object-cover rounded-full mr-2 aspect-square'/> */}
                <h1 className='text-2xl'>{comment.userName}</h1>
              </div>
              {userId === comment.userId || userStatus === 'admin' ? (
                <Dropdown
                  overlay={renderDeleteButton(comment.id)}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <BsThreeDotsVertical className='cursor-pointer' />
                </Dropdown>
              ) : null}
            </div>
            <p className='py-3 max-w-[1000px]' dangerouslySetInnerHTML={{ __html: detectAndStyleLinks(comment.comment) }}></p>
            <div className='flex items-center'></div>
            <p className='text-[#5e5e5e]'>{comment.timestamp.toDate().toLocaleString()}</p>
          </motion.li>
        ))}
      </ul>
    </div>
    </>
  );
}


/* export async function getServerSideProps(context: any) {
  try {
    const { courseId } = context.params;

    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, orderBy('timestamp'));
    const snapshot = await getDocs(q);
    const commentsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      props: {
        courseId,
        comments: commentsData,
      },
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return {
      props: {
        courseId: null,
        comments: [],
      },
    };
  }
} */

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
import clsx from 'clsx';

interface Comment {
  id: string,
  comment: string,
  courseId: string,
  lessonId: string,
  timestamp: Timestamp,
  userId: string,
  userProfilePic: string,
  userBannerPic: string,
  userStatus: string,
  userName: string
  userRoles: Role[]
}

interface Role {
  id: string;
  name: string;
  color: string;
}

export default function Comments({ courseId, lessonId }: { courseId: string, lessonId: any }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const [roles, setRoles] = useState<Role[]>([]);

  const { userId, userStatus } = UserDataFetcher();

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
    const rolesCollection = collection(db, 'roles');

    const unsubscribe = onSnapshot(rolesCollection, (snapshot) => {
      const rolesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        color: doc.data().color,
      }));
      setRoles(rolesData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const commentsData = await Promise.all(snapshot.docs.map(async (doc) => {
            const commentData = doc.data();
            const userProfileData = await getUserProfileData(commentData.userId);

            const userRoles = userProfileData.userRoles && userProfileData.userRoles.map((roleName: string) => {
              const role = roles.find((r) => r.name === roleName);
              return role || { name: roleName, color: 'white' }; // Default color if role not found
            });

            return {
              id: doc.id,
              comment: commentData.comment,
              courseId: commentData.courseId,
              lessonId: commentData.lessonId,
              timestamp: commentData.timestamp,
              userId: commentData.userId,
              userProfilePic: userProfileData.photoUrl || '',
              userBannerPic: userProfileData.bannerUrl || '',
              userName: userProfileData.userName || '',
              userStatus: userProfileData.userStatus || '',
              userRoles: userRoles || "User",
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
  }, [courseId, roles]);


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

  const getUserProfileData = async (userId: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return {
          photoUrl: userData.photoUrl,
          bannerUrl: userData.bannerUrl,
          userName: userData.name,
          userStatus: userData.status,
          userRoles: userData.roles
        };
      }
    } catch (error) {
      console.error('Error fetching user profile data:', error);
    }
    return {
      photoUrl: null, // Return a default profile image URL or handle missing images here
      bannerUrl: null, // Return a default banner URL or handle missing banners here
    };
  };

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength && text.indexOf(' ') === -1) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

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
  

  const CommentTimestamp = ({ createdAt }: { createdAt: Date }) => {
    const commentDate = new Date(createdAt);
    const currentDate = new Date();

    // Check if the comment was made today
    const isToday = commentDate.toDateString() === currentDate.toDateString();

    // Format date & time
    const formattedDate = commentDate.toLocaleDateString();
    const formattedTime = commentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <p className="text-sm opacity-50">
        {isToday ? 'Today at ' + formattedTime : formattedDate}
      </p>
    );
  };

  return (
    <>
    <div className='flex flex-col gap-2 max-w-3/6'>
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
              <div className='flex gap-2 justify-center items-center'>
                <div className="w-12 h-12">
                <UserImagePassable userId={userId} roles={roles} userRoles={comment.userRoles} userBannerUrl={comment.userBannerPic} userImage={comment.userProfilePic} userName={comment.userName} userStatus={comment.userStatus}/>
                </div>
                {/* <Image width={500} height={500} src={comment.userProfilePic} alt="Profile Picture" className='w-10 object-cover rounded-full mr-2 aspect-square'/> */}
                <h1 className={clsx("text-2xl font-medium", comment.userRoles && comment.userRoles.length > 0 && comment.userRoles[0]?.color && `text-${comment.userRoles[0].color}`)}>{comment.userName}</h1>
                <CommentTimestamp createdAt={comment.timestamp.toDate()} />
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
            <p className='py-3 break-all' dangerouslySetInnerHTML={{ __html: detectAndStyleLinks(comment.comment) }}></p>
            <div className='flex items-center'></div>
          </motion.li>
        ))}
      </ul>
    </div>
    </>
  );
}
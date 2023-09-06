import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/utils/firebase';
import { MdDelete } from 'react-icons/md'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { Dropdown } from 'antd';
import Image from 'next/image';

export default function Comments({ courseId }: { courseId: string }) { // Explicitly define the courseId prop type
  const [comments, setComments] = useState<any[]>([]); // Specify any[] as the initial type
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, orderBy('timestamp'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const commentsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
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

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => { // Specify the event type
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
        comment: newComment,
        timestamp: Timestamp.fromDate(new Date()),
        userId: user.uid,
        userName: user.displayName,
        userProfilePic: user.photoURL,
      });

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => { // Specify the commentId type
    try {
      const commentRef = doc(db, 'comments', commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
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
        `<a href="${match}" class="text-yellow-500 underline" target="_blank" rel="noopener noreferrer">${match}</a>`
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

  return (
    <div className='flex flex-col gap-2'>
      <h1 className="text-3xl font-medium">Comments</h1>
      <form onSubmit={handleSubmitComment} className='flex flex-col md:flex-row justify-between items-center w-full gap-2'>
        <input
          placeholder='Type your comment here'
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className='w-full outline-none rounded-full px-6 p-3 bg-[#262626] text-lg'
        />
        <button type="submit" className='bg-[#FEC800] text-black m-1 px-6 p-3 rounded-full font-medium w-full md:w-fit'>Comment</button>
      </form>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className='bg-[#262626] my-4 p-4 rounded-2xl'>
            <div className='flex justify-between items-center'>
              <div className='flex justify-center items-center'>
                <Image width={400} height={400} src={comment.userProfilePic} alt="Profile Picture" className='w-8 h-8 rounded-full mr-2'/>
                <h1 className='text-2xl'>{comment.userName}</h1>
              </div>
              {auth.currentUser && auth.currentUser.uid === comment.userId && (
                <Dropdown
                  overlay={renderDeleteButton(comment.id)}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <BsThreeDotsVertical className='cursor-pointer' />
                </Dropdown>
              )}
            </div>
            <p className='py-3' dangerouslySetInnerHTML={{ __html: detectAndStyleLinks(comment.comment) }}></p>
            <div className='flex items-center'></div>
            <p className='text-[#5e5e5e]'>{comment.timestamp.toDate().toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps(context: any) {
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
}

import { GlobalUser, User } from '@/types/types';
import { db } from '@/utils/firebase';
import { message } from 'antd';
import clsx from 'clsx';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'

export default function Socials(
  {
    user,
    globalUser,
    userId,
    isAuthorized,
  }: {
    user: User;
    globalUser: GlobalUser;
    userId: string;
    isAuthorized: boolean;
  }
) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSocial, setEditedSocial] = useState(user.social || '');

  const handleEditClick = (event: React.MouseEvent<HTMLDivElement>) => {

    // ? if shift, open in new tab
    if (event.shiftKey) {
      return;
    }

    if (isAuthorized) {
      setIsEditing(true);
    }
  };

  const handleSocialUpdate = async () => {
    if(isAuthorized) {

      if (editedSocial.length > 250) {
        message.error('Social must be 250 characters or less.');
        return;
      }
  
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        social: editedSocial,
      });
  
      message.success('Succesfully updated social!');
    } else {
      message.error('You are not permitted to do this!');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSocial(event.target.value);
  };
    
  const handleInputBlur = () => {
    setIsEditing(false);

    if (user.social != editedSocial) {
      handleSocialUpdate()
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      setIsEditing(false);
      
      if (user.social != editedSocial) {
        handleSocialUpdate();
      }
    }
  };

  return (
    <div className="border border-border bg-darkgray rounded-2xl w-full lg:w-80 p-5 flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Socials</h1>
      <div
        onClick={handleEditClick}
        className={clsx(
          'p-2 h-full',
          isAuthorized && 'hover:bg-border cursor-pointer w-full rounded-lg transition',
          isEditing && 'border-2 border-blue-500' // Add a border to indicate editing mode
        )}
      >
        {isEditing ? (
          <input
            className="w-full h-full outline-none resize-none bg-transparent"
            value={editedSocial}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            placeholder={'Add your social...'}
          />
        ) : (
          user.social ? 
            <p className="break-all line-clamp-[12] opacity-90">
              {user.social}
            </p>
          :
            <p>{isAuthorized ? "You haven't added a social. Click to add one!" : "No social provided"}</p>
        )}
      </div>
    </div>
  )
}

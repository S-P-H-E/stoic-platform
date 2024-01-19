'use client';

import { User, GlobalUser } from '@/types/types';
import { db } from '@/utils/firebase';
import { message } from 'antd';
import clsx from 'clsx';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';

const AboutMe = ({
  user,
  globalUser,
  userId,
  isAuthorized,
}: {
  user: User;
  globalUser: GlobalUser;
  userId: string;
  isAuthorized: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(user.description || '');

  const handleEditClick = () => {
    if (isAuthorized) {
      setIsEditing(true);
    }
  };

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedDescription(event.target.value);
  };

  const handleDescriptionUpdate = async () => {
    if(isAuthorized) {

      if (editedDescription.length > 250) {
        message.error('Description must be 250 characters or less.');
        return;
      }
  
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        description: editedDescription,
      });
  
      message.success('Succesfully updated description!');
    } else {
      message.error('You are not permitted to do this!');
    }
  };
  
  const handleTextAreaBlur = () => {
    setIsEditing(false);

    if (user.description != editedDescription) {
      handleDescriptionUpdate()
    }
  };

  const handleTextAreaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      setIsEditing(false);
      
      if (user.description != editedDescription) {
        handleDescriptionUpdate();
      }
    }
  };

  return (
    <section className="border border-border bg-darkgray rounded-2xl w-full lg:h-80 lg:w-80 p-5 flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">About Me</h1>
      <div
        onClick={handleEditClick}
        className={clsx(
          'p-2 h-full',
          isAuthorized && 'hover:bg-border cursor-pointer w-full rounded-lg transition',
          isEditing && 'border-2 border-blue-500' // Add a border to indicate editing mode
        )}
      >
        {isEditing ? (
          <textarea
            className="w-full h-full outline-none resize-none bg-transparent"
            value={editedDescription}
            onChange={handleTextAreaChange}
            onBlur={handleTextAreaBlur}
            onKeyDown={handleTextAreaKeyDown}
            placeholder={'Hello im andrew tate and you are a fucking niger'}
          />
        ) : (
          user.description ? 
            <p className="break-all line-clamp-[12] opacity-90">
              {user.description?.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          :
            <p>{isAuthorized ? "You haven't added a description. Click to add one!" : "No description provided"}</p>
        )}
      </div>
    </section>
  );
};

export default AboutMe;

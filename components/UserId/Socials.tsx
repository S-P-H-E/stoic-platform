import { GlobalUser, User } from '@/types/types';
import { db } from '@/utils/firebase';
import { message } from 'antd';
import clsx from 'clsx';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { FaTiktok, FaInstagram, FaYoutube, FaQuestion } from 'react-icons/fa';
import Link from 'next/link'

enum SocialMediaPlatform {
  TikTok = 'TikTok',
  Instagram = 'Instagram',
  YouTube = 'YouTube',
  Unknown = 'Unknown',
}

const platformLogos = {
  [SocialMediaPlatform.TikTok]: <FaTiktok />,
  [SocialMediaPlatform.Instagram]: <FaInstagram />,
  [SocialMediaPlatform.YouTube]: <FaYoutube />,
  [SocialMediaPlatform.Unknown]: <FaQuestion />,
};

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

  const isCurrentUser = globalUser.id == userId

  const getSocialMediaPlatform = (link: string): SocialMediaPlatform => {
    if (link.includes('tiktok.com')) {
      return SocialMediaPlatform.TikTok;
    } else if (link.includes('instagram.com')) {
      return SocialMediaPlatform.Instagram;
    } else if (link.includes('youtube.com') || link.includes('youtu.be')) {
      return SocialMediaPlatform.YouTube;
    } else {
      return SocialMediaPlatform.Unknown;
    }
  };

  const detectedPlatform = getSocialMediaPlatform(user.social || '');

  const handleEditClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.ctrlKey) {
      window.open(user.social, '_blank', 'noopener noreferrer');
      return
    }

    if (isAuthorized) {
      setIsEditing(true);
    }
  };
  
  const handleRedirect = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!isAuthorized) {
      window.open(user.social, '_blank', 'noopener noreferrer');
    }
  }

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

  // custom styled links like yt
  return (
    <div className="border border-border bg-darkgray rounded-2xl w-full p-5 flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Socials</h1>
      <div
        onClick={handleEditClick}
        className={clsx(
          'p-2 h-full relative group hover:bg-border cursor-pointer w-full rounded-lg transition',
          isEditing && 'border-2 border-blue-500'
        )}
      >
        {isAuthorized && <p className="absolute -top-8 right-0 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition">🔗 ctrl click to visit it</p>}
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
          <div onClick={handleRedirect} className="flex items-center space-x-2 gap-2">
            {detectedPlatform !== SocialMediaPlatform.Unknown && (
              <div>{platformLogos[detectedPlatform]}</div>
            )}

            <p className="break-all line-clamp-1 opacity-90">{user.social}</p>

          </div>
          :
            <p>{isCurrentUser ? "You haven't added a social. Click to add one!" : "This user hasn't added their social."}</p>
        )}
      </div>
    </div>
  )
}

import {GlobalUser, SocialInfo, User} from '@/types/types';
import {db} from '@/utils/firebase';
import {message} from 'antd';
import clsx from 'clsx';
import {doc, updateDoc} from 'firebase/firestore';
import React, {useState} from 'react'
import {FaTiktok, FaInstagram, FaYoutube, FaQuestion} from 'react-icons/fa';
import Link from 'next/link'
import {capitalizeFirstLetter, isValidURL} from "@/utils/utils";
import {FaTwitter} from "react-icons/fa6";

enum SocialMediaPlatform {
    TikTok = 'TikTok',
    Instagram = 'Instagram',
    YouTube = 'YouTube',
    Twitter = 'Twitter',
    Unknown = 'Unknown',
}

const platformLogos = {
    [SocialMediaPlatform.TikTok]: <FaTiktok/>,
    [SocialMediaPlatform.Instagram]: <FaInstagram/>,
    [SocialMediaPlatform.YouTube]: <FaYoutube/>,
    [SocialMediaPlatform.Twitter]: <FaTwitter/>,
    [SocialMediaPlatform.Unknown]: <FaQuestion/>,
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
    const [editedSocials, setEditedSocials] = useState<SocialInfo>({
        tiktok: user.social?.tiktok || '',
        instagram: user.social?.instagram || '',
        youtube: user.social?.youtube || '',
        twitter: user.social?.twitter || '',
    });

    const isCurrentUser = globalUser.id == userId

    const getSocialMediaPlatform = (link: string): SocialMediaPlatform => {
        if (link.includes('tiktok.com')) {
            return SocialMediaPlatform.TikTok;
        } else if (link.includes('instagram.com')) {
            return SocialMediaPlatform.Instagram;
        } else if (link.includes('youtube.com') || link.includes('youtu.be')) {
            return SocialMediaPlatform.YouTube;
        } else if (link.includes('twitter.com')) {
            return SocialMediaPlatform.Twitter;
        } else {
            return SocialMediaPlatform.Unknown;
        }
    };

    const detectedPlatform = getSocialMediaPlatform(user.social?.youtube || '');

    const handleEditClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (isAuthorized) {
            setIsEditing(true);
        }
    };

    const handleRedirect = (event: React.MouseEvent<HTMLDivElement>, platform: SocialMediaPlatform) => {
        event.preventDefault();

        if (!isAuthorized) {
            const socialLink = user.social?.[platform.toLowerCase()];
            if (socialLink) {
                window.open(socialLink, '_blank', 'noopener noreferrer');
            }
        }
    };

    const handleSocialUpdate = async () => {
        if (isAuthorized) {
            const invalidSocial = Object.entries(editedSocials).find(([key, link]) => {
                const isValid = isValidURL(link, key);
                return link && (!isValid || link.length > 250);
            });

            if (invalidSocial) {
                const [key, link] = invalidSocial;
                if (!isValidURL(link, key)) {
                    message.error(`Invalid ${key} link format.`);
                } else {
                    message.error('Social must be 250 characters or less.');
                }
                return;
            }

            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                social: editedSocials,
            });

            message.success('Successfully updated social!');
        } else {
            message.error('You are not permitted to do this!');
        }
    };

    const handleInputChange = (key: keyof SocialInfo, value: string) => {
        setEditedSocials(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleInputBlur = () => {
        setIsEditing(false);

        const userSocial = user?.social as SocialInfo | undefined;

        if (userSocial) {
            const updatedSocials = Object.keys(editedSocials).reduce((acc, key) => {
                const link = editedSocials[key];
                const isValid = isValidURL(link, key);

                if (!link || (isValid && link.length <= 250)) {
                    acc[key] = link;
                } else {
                    message.error(`Invalid ${capitalizeFirstLetter(key)} link format.`);
                    acc[key] = '';
                }

                return acc;
            }, {} as SocialInfo);

            setEditedSocials(updatedSocials);

            // Perform the update only if any link has changed
            if (Object.values(userSocial).some((link, index) => link !== updatedSocials[Object.keys(userSocial)[index]])) {
                handleSocialUpdate();
            }
        }
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            setIsEditing(false);

            const userSocial = user?.social as SocialInfo | undefined;

            if (userSocial) {
                const updatedSocials = Object.keys(editedSocials).reduce((acc, key) => {
                    const link = editedSocials[key];
                    const isValid = isValidURL(link, key);

                    if (!link || (isValid && link.length <= 250)) {
                        acc[key] = link;
                    } else {

                        message.error(`Invalid ${capitalizeFirstLetter(key)} link format.`);
                        acc[key] = '';
                    }

                    return acc;
                }, {} as SocialInfo);

                setEditedSocials(updatedSocials);

                // Perform the update only if any link has changed
                if (Object.values(userSocial).some((link, index) => link !== updatedSocials[Object.keys(userSocial)[index]])) {
                    handleSocialUpdate();
                }
            }
        }
    };

    // custom styled links like yt
    return (
        <div className="border border-border bg-darkgray rounded-2xl w-full px-3 py-4 flex flex-col gap-2">
            <h1 className="text-2xl font-semibold pl-2 pt-1">Socials</h1>
            <div
                onClick={handleEditClick}
                className={clsx(
                    'p-2 h-full relative cursor-pointer w-full rounded-lg',
                    isEditing && 'border-2 border-blue-500',
                    isCurrentUser && 'hover:bg-border transition'
                )}
            >
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        {Object.keys(editedSocials).map((key, index) => (
                            <input
                                key={key}
                                className="w-full h-full outline-none resize-none bg-transparent"
                                value={editedSocials[key]}
                                onChange={(event) => handleInputChange(key as keyof SocialInfo, event.target.value)}
                                onBlur={handleInputBlur}
                                onKeyDown={handleInputKeyDown}
                                placeholder={`Add your ${key} link...`}
                            />
                        ))}
                    </div>
                ) : (
                    <div>
                        {Object.values(editedSocials).some(link => link) ? (
                            Object.entries(editedSocials).map(([key, value]) => (
                                value && (
                                    <div key={key} onClick={(event) => handleRedirect(event, getSocialMediaPlatform(value))} className="hover:bg-border rounded-lg py-1 px-2 transition flex items-center gap-x-3">
                                        {detectedPlatform !== SocialMediaPlatform.Unknown && (
                                            <div>{platformLogos[getSocialMediaPlatform(value)]}</div>
                                        )}
                                        <p className="w-[90%] break-all line-clamp-1 opacity-90">{value}</p>
                                    </div>
                                )
                            ))
                        ) : (
                            <p>{isCurrentUser ? "You haven't added any socials. Click to add one!" : "This user hasn't added any socials."}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

// DraggableChannel.tsx
"use client"

import React, { useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import clsx from 'clsx';

interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
  permissions: {
    [key: string]: {
      canMessage: boolean;
      canSeeChannel: boolean;
      canSeeMessages: boolean;
      [key: string]: boolean; // additional dynamic permissions
    };
  };
  order: number;
}

interface DraggableChannelProps {
  channel: Channel;
  onDragEnd: (id: string, order: number) => void;
  onClick: () => void;
  channelId: string;
  userStatus: string | undefined;
}


const DraggableChannel: React.FC<DraggableChannelProps> = ({ channel, channelId, onDragEnd, onClick, userStatus }) => {
  const [isDragging, setIsDragging] = useState(false);

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  const handleDragEnd = async (event: any, info: any) => {
    setIsDragging(false);
    const { offset } = info;
    const distance = Math.abs(offset.y);
  
    if (distance > 70) {
      // Implement the logic to update the order in Firebase Firestore
      const newOrder = offset.y > 0 ? channel.order + 1 : channel.order - 1;
      await onDragEnd(channel.id, newOrder);
    }
  
    controls.start({ y: 0, transition: { duration: 0.5, type: 'spring', stiffness: 400, damping: 25 } });
  };

  return (
<motion.div
  ref={ref}
  drag={userStatus == 'admin' ? "y" : false}
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={1}
  onDragEnd={handleDragEnd}
  onDragStart={() => setIsDragging(true)}
  animate={controls}
  style={{ width: '100%' }}
>
  <div onClick={() => {if (!isDragging) {onClick();}}} className={clsx('animate-pop px-4 hover:cursor-pointer py-2 text-lg bg-[--darkgray] border border-[--border] rounded-xl hover:bg-[--border] transition', channelId == channel.id && 'bg-white hover:bg-white/80 text-black')}>
    {truncateText(channel.name, 20)}
  </div>
</motion.div>
  );
};

export default DraggableChannel;

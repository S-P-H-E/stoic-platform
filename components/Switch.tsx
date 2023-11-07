"use client"
import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SwitchProps {
  initialTab: 'first' | 'second';
  firstComponent: ReactNode;
  secondComponent: ReactNode;
}

const Switch: React.FC<SwitchProps> = ({
  initialTab,
  firstComponent,
  secondComponent,
}) => {
  const [activeTab, setActiveTab] = useState<'first' | 'second'>(
    initialTab
  );

  const switchVariants = {
    first: { opacity: 1, x: 0 },
    second: { opacity: 1, x: 0 },
  };

  const toggleVariants = {
    left: { x: 0 },
    right: { x: '100%' },
  };

  return (
    <div className="w-full">
      <div className="flex justify-center relative">
        <div
          className={`flex p-1 w-[7.5rem] rounded-full cursor-pointer relative ${
            activeTab === 'first' ? 'bg-blue-500' : 'bg-green-500' // Change the colors for active and inactive tabs
          }`}
          onClick={() =>
            setActiveTab(activeTab === 'first' ? 'second' : 'first')
          }
        >
          <motion.button
            variants={toggleVariants}
            initial={activeTab === 'first' ? 'left' : 'right'}
            animate={activeTab === 'first' ? 'left' : 'right'}
            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
            className="text-xs p-2 h-7 bg-white text-black rounded-full z-10 items-center flex"
          >
            <p>{activeTab === 'first' ? 'Lesson' : 'Course'}</p>
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={switchVariants}
          initial={{ opacity: 0, x: activeTab === 'first' ? -30 : 30 }}
          animate={activeTab}
          exit={{ opacity: 0, x: activeTab === 'first' ? -30 : 30 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'first' ? firstComponent : secondComponent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Switch;
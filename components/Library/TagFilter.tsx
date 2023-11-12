"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ButtonShad } from '../ui/buttonshad';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { AiOutlinePlus } from 'react-icons/ai';
import CreateTag from './CreateTag';

type Tag = {
  id: string;
  name: string;
};

interface TagFilterProps {
  tags: Tag[]
  onTagFilter: (tag: string) => void;
  selectedTags: string[];
  userStatus: string | undefined;
  onDeleteTag: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, onTagFilter, onDeleteTag, selectedTags, userStatus }) => {

  const fadeInAnimationVariants = { // for framer motion  
    initial: {
        opacity: 0,
        x: -100,
    },
    animate: (index: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: 0.03 * index,
        }
    })
  }

  return (
      <motion.ul className="flex list-none flex-wrap gap-2"> {/* Apply 'list-none' class to remove bullets */}
        {tags.map((tag, index) => (
          <motion.li
            key={tag.id}
            custom={index}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
          >
          <ContextMenu>
            <ContextMenuTrigger>
            <ButtonShad
              variant="outline"
              onClick={() => onTagFilter(tag.name)}
              className={`px-2 py-1 whitespace-nowrap	${
                selectedTags.includes(tag.name) ? 'hover:bg-white/80 bg-white text-black border-white' : ''
              }`}
            >
              {tag.name}
            </ButtonShad>
            </ContextMenuTrigger>
              {userStatus === 'admin' && (
            <ContextMenuContent>
              <ContextMenuItem onClick={() => onDeleteTag(tag.id)} className="cursor-pointer">
                <button>Delete</button>
              </ContextMenuItem>
            </ContextMenuContent>
            )}
          </ContextMenu>
          </motion.li>
        ))}

      {userStatus == 'admin' ?
        <Dialog>
          <DialogTrigger>
          <ButtonShad
          variant="outline"
          className="group border-dotted border-2 px-2 py-1 gap-1"
          >
            Add a tag
            <AiOutlinePlus className="group-hover:scale-110 transition"/>
          </ButtonShad>
          </DialogTrigger>
          <DialogContent>
            <CreateTag/>
          </DialogContent>
        </Dialog>
        : null}
      </motion.ul>
  );
};

export default TagFilter;
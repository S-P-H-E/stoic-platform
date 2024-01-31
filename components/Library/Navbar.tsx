import CreateButton from '@/components/Library/CreateButton'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import TagFilter from './TagFilter';
import SearchBar from './Searchbar';

type Tag = {
  id: string;
  name: string;
};

interface SearchBarProps {
  onSearch: (searchQuery: string) => void;
}

interface TagFilterProps {
  tags: Tag[]
  onTagFilter: (tag: string) => void;
  selectedTags: string[];
  userStatus: string | undefined;
  onDeleteTag: (tag: string) => void;
}

interface NavbarProps {
  handleTagDelete: (tagId: string) => void;
  handleTagFilter: (tagName: string) => void;
  handleSearch: (query: string) => void; 
}

type LibraryNavbarProps = SearchBarProps & TagFilterProps & NavbarProps;

export default function LibraryNavbar({ handleTagDelete, handleTagFilter, handleSearch, onSearch, tags, onTagFilter, onDeleteTag, selectedTags, userStatus }: LibraryNavbarProps) {
    const [hidden, setHidden] = useState(false)
    const {scrollY} = useScroll()

    useMotionValueEvent(scrollY, 'change', (latest) => {
      const previous = scrollY.getPrevious()
      if (latest > previous && latest > 170) {
        setHidden(true)
      } else {
        setHidden(false)
      }
    })
  return (
    <motion.nav
    transition={{duration: 0.45, ease: "easeInOut"}}
    animate={hidden ? 'hidden' : 'visible'}
    variants={{visible: {y: 0}, hidden: {y: "-100%"}}}
    className="z-30 sticky bg-bg bg-opacity-90 py-3 backdrop-blur-md top-0 flex flex-col gap-4">

        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-4">
          <h1 className='text-3xl font-semibold'>Library</h1>
          <CreateButton/>
          </div>
        </div>
        <TagFilter
        onDeleteTag={handleTagDelete}
        tags={tags}
        onTagFilter={handleTagFilter}
        selectedTags={selectedTags}
        userStatus={userStatus}
      />
      <SearchBar onSearch={handleSearch} />
    </motion.nav>
  )
}

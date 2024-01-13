"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (searchQuery: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <motion.div
    initial={{opacity:0, y:-100}}
    animate={{opacity:1, y:0}}
    >
      <input
        type="text"
        placeholder='Search Resources...'
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="px-4 py-2 rounded-lg border w-full bg-darkgray shadow focus:border-white/80 border-border transition duration-200 outline-none"
      />
    </motion.div>
  );
};

export default SearchBar;
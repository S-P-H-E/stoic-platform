import React, { useState } from 'react'
import Input from '../UI Elements/Input'
import Button from '../UI Elements/Button'
import { useTagCreator } from '@/utils/useTagCreate';
import clsx from 'clsx';
import { message } from 'antd';

export default function CreateTag() {
  const [tagName, setTagName] = useState<string>("")
  const { createTag, isLoadingTag, error } = useTagCreator();

  const handleCreateTag = () => {
    if (tagName.trim() !== '') {
      createTag(tagName);
      message.success("Tag successfully created")
      setTagName('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <h1 className="text-lg font-semibold">Add a tag</h1>
      <div className="flex flex-col items-center justify-center gap-3 w-full">
        <Input type="text" onChange={(e) => setTagName(e.target.value)} placeholder='Enter the name of tag'/>
        <Button disabled={isLoadingTag} onClick={handleCreateTag}
          className={clsx({
          'text-highlight': isLoadingTag,
        })}
        >
          {isLoadingTag ?
          <p>Creating tag...</p>
          : <p>Create tag</p>
          }
        </Button>
        {error && <p>Error: {error.message}</p>}
      </div>
    </div>
  )
}

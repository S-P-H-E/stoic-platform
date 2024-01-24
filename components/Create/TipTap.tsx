import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './Toolbar';
import Heading from "@tiptap/extension-heading"
import BulletList from "@tiptap/extension-bullet-list"
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';

interface TipTapProps {
    content: string;
    onChange: (richText: string) => void;
}

export default function TipTap({content, onChange}: TipTapProps) {
    const editor = useEditor({
        extensions: [BulletList, ListItem, StarterKit.configure({
            
        }),Heading.configure({
            HTMLAttributes: {
                class: "text-xl font-bold",
                levels: [2]
            }
        }),
        Blockquote.configure({
            HTMLAttributes: {
              class: 'text-xs',
            },
        })
        ],
        /* content: content, */
        editorProps: {
            attributes: {
                class: "rounded-lg ring-2 ring-2 px-2 ring-highlight focus:ring-sky-600 min-h-[200px] bg-transparent outline-none transition p-2"
            },
        }, onUpdate({editor}) {
            onChange(editor.getHTML())
            console.log(editor.getHTML())
            console.log(editor.getText())
        }
    })
  return (
    <div className="flex flex-col gap-2 justify-center min-h-[200px]">
        <Toolbar editor={editor}/>
        <EditorContent editor={editor}/>
    </div>
  )
}

"use client"
import React from 'react'
import { type Editor } from '@tiptap/react'
import { Toggle } from '../ui/toggle'
import { Bold, Heading2, Italic, List, ListOrdered, Quote, Strikethrough } from 'lucide-react'

export default function Toolbar({editor}: {editor: Editor | null}) {
    if (!editor) {
        return null
    }
  return (
    <div className="ring-2 hover:ring-sky-600 transition ring-highlight p-1 rounded-lg">
      <Toggle
      size="sm"
      pressed={editor.isActive("heading")}
      onPressedChange={() =>
        editor.chain().focus().toggleHeading({ level: 2 }).run()
      }
      >
        <Heading2 className="w-4 h-4"/>
      </Toggle>

      <Toggle
      size="sm"
      pressed={editor.isActive("bold")}
      onPressedChange={() =>
        editor.chain().focus().toggleBold().run()
      }
      >
        <Bold className="w-4 h-4"/>
      </Toggle>

      <Toggle
      size="sm"
      pressed={editor.isActive("italic")}
      onPressedChange={() =>
        editor.chain().focus().toggleItalic().run()
      }
      >
        <Italic className="w-4 h-4"/>
      </Toggle>

      <Toggle
      size="sm"
      pressed={editor.isActive("strike")}
      onPressedChange={() =>
        editor.chain().focus().toggleStrike().run()
      }
      >
        <Strikethrough className="w-4 h-4"/>
      </Toggle>

      <Toggle
      size="sm"
      pressed={editor.isActive("bulletList")}
      onPressedChange={() =>
        editor.chain().focus().toggleBulletList().run()
      }
      >
        <List className="w-4 h-4"/>
      </Toggle>

      <Toggle
      size="sm"
      pressed={editor.isActive("orderedList")}
      onPressedChange={() =>
        editor.chain().focus().toggleOrderedList().run()
      }
      >
        <ListOrdered className="w-4 h-4"/>
      </Toggle>

      <Toggle
      size="sm"
      pressed={editor.isActive("blockQuote")}
      onPressedChange={() =>
        editor.chain().focus().toggleBlockquote().run()
      }
      >
        <Quote className="w-4 h-4"/>
      </Toggle>

    </div>
  )
}

"use client"
import React from 'react'
import { type Editor } from '@tiptap/react'
import { Toggle } from '../ui/toggle'
import { Bold, Heading2, Italic, List, ListOrdered, Quote, Strikethrough, AlignLeft, AlignCenter, AlignRight, } from 'lucide-react'

export default function Toolbar({editor}: {editor: Editor | null}) {

    if (!editor) {
      return null
    }
    
  return (
    <div className="relative ring-2 h-11 hover:ring-sky-600 transition ring-highlight p-1 rounded-lg flex">
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
      pressed={editor.isActive("blockquote")}
      onPressedChange={() =>
        editor.chain().focus().toggleBlockquote().run()
      }
      >
        <Quote className="w-4 h-4"/>
      </Toggle>

      <div className="w-0.5 mx-1.5 rounded h-full bg-highlight"/>

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: 'left' })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign('left').run()
        }
      >
        <AlignLeft className="w-4 h-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: 'center' })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign('center').run()
        }
      >
        <AlignCenter className="w-4 h-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: 'right' })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign('right').run()
        }
      >
        <AlignRight className="w-4 h-4" />
      </Toggle>

      <div className="w-0.5 mx-1.5 rounded h-full bg-highlight"/>

      <Toggle
        size="sm"
        pressed={editor.isActive('textStyle', { fontFamily: 'Inter' })}
        onPressedChange={() =>
          editor.chain().focus().setFontFamily('Inter').run()
        }
      >
        Inter
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('textStyle', { fontFamily: 'Geist' })}
        onPressedChange={() =>
          editor.chain().focus().setFontFamily('Geist').run()
        }
      >
        Geist
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('textStyle', { fontFamily: 'Montserrat' })}
        onPressedChange={() =>
          editor.chain().focus().setFontFamily('Montserrat').run()
        }
      >
        Montserrat
      </Toggle>

    </div>
  )
}

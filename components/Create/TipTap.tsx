import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6';
import { ButtonShad } from '../ui/buttonshad';
import { FormLabel } from '../ui/form';

interface TipTapProps {
  /*   content: string | string[];
  onChange: (richText: string) => void; */
  currentPage: number;
  onPageChange: (newPage: number, updatedHTMLContent?: string) => void;
  contents: string[];
  predefinedHTMLContent?: string;
}

export default function TipTap({
  /*  onChange, */
  currentPage,
  onPageChange,
  contents,
  predefinedHTMLContent
}: TipTapProps) {
  const [HTMLContent, setHTMLContent] = useState('');

  /* const [currentPage, setCurrentPage] = useState(0); */
  /* const [contents, setContents] = useState<string[]>(['']); */

  /*     useEffect(() => {
        setContents((prevContents) => {
          const newContents = [...prevContents];
          newContents[currentPage] = HTMLContent;
          return newContents;
        });
      }, [HTMLContent, currentPage]); */

  const editor = useEditor({
    extensions: [
      Image,
      TextStyle,
      Dropcursor,
      FontFamily,
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'min-h-[1rem]'
          }
        }
      }),
      Heading.configure({
        HTMLAttributes: {
          class: 'text-xl font-bold',
          levels: [2],
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-2 pl-2 border-highlight',
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-3',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-3',
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: 'ml-3',
        },
      }),
      TextAlign.configure({
        alignments: ['left', 'right', 'center'],
        types: ['heading', 'paragraph'],
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    content: contents[currentPage],
    editorProps: {
      attributes: {
        class:
          'rounded-lg ring-2 ring-2 px-2 ring-highlight focus:ring-sky-600 min-h-[200px] bg-transparent outline-none transition p-2',
      },
    },
    onUpdate({ editor }) {
      const updatedHTMLContent = editor.getHTML();
      /*       onChange(updatedHTMLContent); */
      setHTMLContent(updatedHTMLContent);

      if (
        !editor.isActive('textStyle', { fontFamily: 'Montserrat' }) &&
        !editor.isActive('textStyle', { fontFamily: 'Geist' })
      ) {
        editor.chain().focus().setFontFamily('Inter').run();
      }
    },
  });

  useEffect(() => {
    editor?.commands.setContent(contents[currentPage]);
  }, [currentPage, contents, editor]);

  const goToNextPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onPageChange(currentPage + 1, HTMLContent);
    setHTMLContent('');
    editor?.commands.clearContent();
  };

  const goToPreviousPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onPageChange(currentPage - 1);
    setHTMLContent(contents[currentPage - 1]);
    editor?.commands.clearContent();
  };

  const addImage = useCallback(() => {
    const url = window.prompt('URL');

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <div className="flex flex-col gap-2 justify-center min-h-[200px]">
      {/* <button onClick={addImage}>setImage</button> */}
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />

      <div className="flex justify-center items-center gap-4">
        <ButtonShad
          variant={currentPage != 0 ? 'secondary' : 'default'}
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
        >
          <FaCaretLeft size={20} />
        </ButtonShad>
        <div className="font-medium text-lg">{currentPage + 1}</div>
        <ButtonShad
          variant={
            (HTMLContent !== '' && HTMLContent !== '<p></p>') ||
            (predefinedHTMLContent && predefinedHTMLContent !== '<p></p>')
              ? 'secondary'
              : 'default'
          }
          onClick={goToNextPage}
          disabled={HTMLContent === '' && (!predefinedHTMLContent || predefinedHTMLContent === '<p></p>')}
        >
          <FaCaretRight size={20} />
        </ButtonShad>
      </div>

      {(HTMLContent ?? predefinedHTMLContent) && (
        <div className="mt-4">
          <FormLabel className="text-lg">Preview</FormLabel>
          <pre dangerouslySetInnerHTML={{ __html: (HTMLContent || predefinedHTMLContent) ?? '' }} />
        </div>
      )}
    </div>
  );
}

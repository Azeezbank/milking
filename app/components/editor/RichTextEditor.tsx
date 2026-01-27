
"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: value,
      immediatelyRender: false,
      onUpdate: ({ editor }) => onChange(editor.getHTML()),
      editorProps: {
        attributes: {
          class:
            "min-h-[180px] p-4 " +
            "prose max-w-none text-slate-800 cursor-text " +
            "focus:outline-none focus:ring-0 " +
            "shadow-none border-none",
          spellCheck: "true",
        },
      },
    },
    [mounted]
  );

  if (!mounted || !editor) return null;

  return (
    <div className="border border-slate-300 rounded-xl bg-white overflow-hidden">

      {/* Toolbar */}
      <div className="flex items-center gap-1 bg-slate-50 border-b border-slate-200 px-2 py-1">
        <ToolButton onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolButton>

        <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolButton>

        <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolButton>

        <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolButton>
      </div>

      {/* Clickable Editor Wrapper */}
      <div
        className="min-h-45 cursor-text"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent
          editor={editor}
          className="focus:outline-none focus:ring-0 shadow-none"
        />
      </div>
    </div>
  );
}

const ToolButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="p-2 rounded-lg text-slate-600
               hover:bg-sky-100 hover:text-sky-700 transition"
  >
    {children}
  </button>
);
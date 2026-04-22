"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Link as LinkIcon,
  ImageIcon,
  Undo,
  Redo,
  Minus,
} from "lucide-react";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition ${
        active
          ? "bg-brand-purple-100 text-brand-purple-600"
          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: placeholder ?? "Start writing your post…",
      }),
      CharacterCount,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[400px] prose prose-stone prose-sm max-w-none focus:outline-none px-5 py-4",
      },
    },
  });

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error();
        const data = await res.json();
        editor.chain().focus().setImage({ src: data.url }).run();
      } catch {
        toast.error("Image upload failed");
      }
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className="border border-stone-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-purple-500 focus-within:border-transparent">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap px-3 py-2 border-b border-stone-200 bg-stone-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-stone-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-stone-300 mx-1" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-stone-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-stone-300 mx-1" />

        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Insert Link">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => imageInputRef.current?.click()}
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <div className="ml-auto text-xs text-stone-400">
          {editor.storage.characterCount.words()} words
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

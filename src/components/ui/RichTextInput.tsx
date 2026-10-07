import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextB, TextItalic, ListBullets } from '@phosphor-icons/react'

interface RichTextInputProps {
  value: string
  onChange: (html: string) => void
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
        active
          ? 'bg-zinc-200 text-zinc-900'
          : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'
      }`}
    >
      {children}
    </button>
  )
}

export default function RichTextInput({ value, onChange }: RichTextInputProps) {
  const lastEmitted = useRef(value)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        hardBreak: false,
      }),
    ],
    content: normalizeToHtml(value),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      lastEmitted.current = html
      onChange(html)
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[80px] w-full px-3 py-2 text-sm text-zinc-900 outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== lastEmitted.current) {
      editor.commands.setContent(normalizeToHtml(value), false)
      lastEmitted.current = value
    }
  }, [value, editor])

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white transition focus-within:border-zinc-300 focus-within:ring-2 focus-within:ring-black/[0.06]">
      <div className="flex items-center gap-0.5 border-b border-zinc-100 px-2 py-1">
        <ToolbarButton
          title="Bold"
          active={editor?.isActive('bold') ?? false}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <TextB size={13} weight="bold" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor?.isActive('italic') ?? false}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <TextItalic size={13} />
        </ToolbarButton>
        <div className="mx-1 h-3.5 w-px bg-zinc-200" />
        <ToolbarButton
          title="Bullet list"
          active={editor?.isActive('bulletList') ?? false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <ListBullets size={13} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

function normalizeToHtml(content: string): string {
  if (!content.trim()) return ''
  if (content.trimStart().startsWith('<')) return content
  // Plain text migration: convert newline-separated lines to paragraphs/bullets
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean)
  return lines
    .map((line) => {
      if (/^[-•*]\s/.test(line)) {
        return `<ul><li><p>${line.replace(/^[-•*]\s*/, '')}</p></li></ul>`
      }
      return `<p>${line}</p>`
    })
    .join('')
}

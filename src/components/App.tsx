import { useState, useRef, useEffect, useMemo, createElement, lazy, Suspense } from 'react'
import { pdf } from '@react-pdf/renderer'
import type { DocumentProps } from '@react-pdf/renderer'
import { Eye, PencilSimple } from '@phosphor-icons/react'
import { useResumeStore } from '../store/resumeStore'
import { getTemplate } from '../templates'
import { preloadFonts } from '../templates/classic/renderer'
import EditMenu from './EditMenu'
import { Toaster } from './ui/sonner'
import { Button } from './ui/button'

const MIN_EDITOR_W = 320
const MAX_EDITOR_W = 640
const DEFAULT_EDITOR_W = MAX_EDITOR_W

const CVPreview = lazy(() => import('./CVPreview'))

function App() {
  const resumeData = useResumeStore((s) => s.resumeData)
  const sectionsOrder = useResumeStore((s) => s.sectionsOrder)
  const viewMode = useResumeStore((s) => s.viewMode)
  const setViewMode = useResumeStore((s) => s.setViewMode)

  const previewContainerRef = useRef<HTMLDivElement>(null)

  const [editorWidth, setEditorWidth] = useState(DEFAULT_EDITOR_W)
  const dragRef = useRef<{ startX: number; startW: number } | null>(null)

  const onHandleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { startX: e.clientX, startW: editorWidth }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onHandleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    const newW = Math.max(MIN_EDITOR_W, Math.min(MAX_EDITOR_W, dragRef.current.startW + e.clientX - dragRef.current.startX))
    setEditorWidth(newW)
  }
  const onHandleDragEnd = () => { dragRef.current = null }

  const { renderer } = getTemplate(resumeData.templateId)

  const documentElement = useMemo(
    () =>
      createElement(renderer, {
        data: resumeData,
        options: resumeData.templateOptions,
        sectionsOrder,
      }) as React.ReactElement<DocumentProps>,
    [resumeData, sectionsOrder, renderer],
  )

  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const prevPdfUrl = useRef<string | null>(null)

  useEffect(() => {
    preloadFonts().catch(() => {})
    return () => { if (prevPdfUrl.current) URL.revokeObjectURL(prevPdfUrl.current) }
  }, [])

  useEffect(() => {
    let cancelled = false
    setPdfLoading(true)
    const id = setTimeout(async () => {
      if (cancelled) return
      try {
        const instance = pdf()
        instance.updateContainer(documentElement)
        const blob = await instance.toBlob()
        if (cancelled) return
        const [buffer, url] = await Promise.all([
          blob.arrayBuffer(),
          Promise.resolve(URL.createObjectURL(blob)),
        ])
        if (cancelled) return
        if (prevPdfUrl.current) URL.revokeObjectURL(prevPdfUrl.current)
        prevPdfUrl.current = url
        setPdfBuffer(buffer)
        setPdfUrl(url)
      } catch (err) {
        console.error('[PDF] generation failed:', err)
      } finally {
        if (!cancelled) setPdfLoading(false)
      }
    }, 150)
    return () => { cancelled = true; clearTimeout(id) }
  }, [documentElement])

  return (
    <>
      <Toaster richColors />
      <div className="flex h-screen overflow-hidden font-normal antialiased">

        {/* Editor panel */}
        <div
          className={`h-full shrink-0 overflow-hidden bg-background ${
            viewMode === 'edit' ? 'block' : 'hidden'
          } lg:block`}
          style={{ width: editorWidth }}
        >
          <div className="h-full overflow-x-hidden overflow-y-auto" style={{ width: editorWidth }}>
            <EditMenu pdfInstance={{ loading: pdfLoading, url: pdfUrl, error: null }} />
          </div>
        </div>

        {/* Resize handle — desktop only. Single 1px line + pill + collapse on hover. */}
        <div
          className="group relative hidden shrink-0 cursor-col-resize select-none lg:block"
          style={{ width: 8, marginLeft: -8, zIndex: 20 }}
          onPointerDown={onHandleDragStart}
          onPointerMove={onHandleDragMove}
          onPointerUp={onHandleDragEnd}
          onPointerCancel={onHandleDragEnd}
        >
          {/* The single separator line */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-zinc-200 transition-colors group-hover:bg-zinc-400" />
          {/* Grip pill */}
          <div className="pointer-events-none absolute top-1/2 right-0 h-10 w-px translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent transition-all group-hover:w-[3px] group-hover:bg-zinc-400" />
        </div>

        {/* Preview — takes remaining width */}
        <div
          ref={previewContainerRef}
          className={`h-full min-w-0 flex-1 bg-[oklch(0.18_0_0)] ${
            viewMode === 'preview' ? 'block' : 'hidden'
          } lg:block`}
        >
          <Suspense fallback={null}>
            <CVPreview pdfBuffer={pdfBuffer} loading={pdfLoading} />
          </Suspense>
        </div>

        {/* Mobile tab toggle */}
        <Button
          className="fixed bottom-5 right-5 z-40 gap-2 shadow-md lg:hidden"
          onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
        >
          {viewMode === 'edit' ? (
            <>
              <Eye size={16} />
              <span>Preview</span>
            </>
          ) : (
            <>
              <PencilSimple size={16} />
              <span>Edit</span>
            </>
          )}
        </Button>
      </div>
    </>
  )
}

export default App

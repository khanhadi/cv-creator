import { useEffect, useState, useRef } from 'react'
import { TransformWrapper, TransformComponent, useControls, useTransformComponent } from 'react-zoom-pan-pinch'
import { Document, Page, pdfjs } from 'react-pdf'
import { Minus, Plus, Maximize2, Loader2 } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const BASE_PAGE_WIDTH = 1800
const A4_RATIO = 842 / 595

interface CVPreviewProps {
  url: string | null
  loading: boolean
  containerWidth: number
  containerHeight: number
}

function Controls({
  containerWidth,
  containerHeight,
}: {
  containerWidth: number
  containerHeight: number
}) {
  const { zoomIn, zoomOut, centerView } = useControls()
  const scale = useTransformComponent(({ state }) => state.scale)

  const fitScale =
    Math.min(
      (containerWidth - 64) / BASE_PAGE_WIDTH,
      (containerHeight - 64) / (BASE_PAGE_WIDTH * A4_RATIO),
    ) || 1

  const handleFit = () => centerView(fitScale)

  useEffect(() => {
    if (containerWidth > 0 && containerHeight > 0) centerView(fitScale)
  }, [containerWidth, containerHeight])

  return (
    <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-lg border border-zinc-200 bg-white p-1 shadow-md">
      <ToolbarButton onClick={() => zoomOut(0.25)} title="Zoom out">
        <Minus size={13} />
      </ToolbarButton>
      <span className="flex h-7 min-w-[44px] items-center justify-center px-1 text-xs tabular-nums text-zinc-400">
        {Math.round(scale * 100)}%
      </span>
      <ToolbarButton onClick={() => zoomIn(0.25)} title="Zoom in">
        <Plus size={13} />
      </ToolbarButton>
      <div className="mx-1 h-4 w-px bg-zinc-200" />
      <button
        className="flex h-7 items-center gap-1.5 rounded px-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100"
        onClick={handleFit}
      >
        <Maximize2 size={12} />
        Fit
      </button>
    </div>
  )
}

function ToolbarButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      className="flex h-7 w-7 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-100"
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  )
}

export default function CVPreview({
  url,
  loading,
  containerWidth,
  containerHeight,
}: CVPreviewProps) {
  const [displayUrl, setDisplayUrl] = useState<string | null>(null)
  const centerRef = useRef<((scale: number) => void) | null>(null)
  const hasCentered = useRef(false)

  useEffect(() => { if (url) setDisplayUrl(url) }, [url])

  const fitScale =
    containerWidth > 0 && containerHeight > 0
      ? Math.min(
          (containerWidth - 64) / BASE_PAGE_WIDTH,
          (containerHeight - 64) / (BASE_PAGE_WIDTH * A4_RATIO),
        )
      : 0.75

  // Auto-fit once the PDF loads and we have dimensions
  const handleDocumentLoad = () => {
    if (!hasCentered.current && centerRef.current) {
      hasCentered.current = true
      centerRef.current(fitScale)
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-100">
      {displayUrl ? (
        <TransformWrapper
          centerOnInit
          initialScale={fitScale}
          minScale={0.1}
          maxScale={2}
          limitToBounds
          wheel={{ step: 0.001 }}
        >
          {({ centerView }) => {
            centerRef.current = centerView
            return (
              <>
                <TransformComponent
                  wrapperStyle={{ width: '100%', height: '100%' }}
                  contentStyle={{ cursor: 'grab' }}
                >
                  <Document
                    file={displayUrl}
                    loading={null}
                    onLoadSuccess={handleDocumentLoad}
                    onLoadError={(err) =>
                      console.error('[CVPreview] PDF load error:', err)
                    }
                  >
                    <Page
                      pageNumber={1}
                      width={BASE_PAGE_WIDTH}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                </TransformComponent>
                <Controls
                  containerWidth={containerWidth}
                  containerHeight={containerHeight}
                />
              </>
            )
          }}
        </TransformWrapper>
      ) : (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="animate-spin text-zinc-400" size={24} />
        </div>
      )}

      {loading && displayUrl && (
        <div className="absolute right-4 top-4 rounded-md bg-white/80 p-1.5 shadow-sm backdrop-blur-sm">
          <Loader2 className="animate-spin text-zinc-400" size={14} />
        </div>
      )}
    </div>
  )
}

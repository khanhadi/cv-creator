import { useState, useRef, useEffect } from 'react'
import { Minus, Plus, CircleNotch, ArrowsHorizontal, ArrowsOutSimple, Hand, CopySimple } from '@phosphor-icons/react'
import { usePdfiumEngine } from '@embedpdf/engines/react'
import { EmbedPDF } from '@embedpdf/core/react'
import { createPluginRegistration } from '@embedpdf/core'
import {
  DocumentContent,
  DocumentManagerPluginPackage,
  useDocumentManagerCapability,
} from '@embedpdf/plugin-document-manager/react'
import { Viewport, ViewportPluginPackage } from '@embedpdf/plugin-viewport/react'
import { Scroller, ScrollPluginPackage } from '@embedpdf/plugin-scroll/react'
import { RenderLayer, RenderPluginPackage } from '@embedpdf/plugin-render/react'
import { TilingLayer, TilingPluginPackage } from '@embedpdf/plugin-tiling/react'
import { ZoomPluginPackage, ZoomMode, ZoomGestureWrapper, useZoom } from '@embedpdf/plugin-zoom/react'
import { SelectionLayer, SelectionPluginPackage, useSelectionCapability } from '@embedpdf/plugin-selection/react'
import {
  InteractionManagerPluginPackage,
  GlobalPointerProvider,
  PagePointerProvider,
} from '@embedpdf/plugin-interaction-manager/react'
import { PanPluginPackage, usePan } from '@embedpdf/plugin-pan/react'

const DOC_ID = 'cv'

const plugins = [
  createPluginRegistration(DocumentManagerPluginPackage, { maxDocuments: 1 }),
  createPluginRegistration(ViewportPluginPackage, { viewportGap: 16 }),
  createPluginRegistration(ScrollPluginPackage),
  createPluginRegistration(InteractionManagerPluginPackage),
  createPluginRegistration(RenderPluginPackage),
  createPluginRegistration(TilingPluginPackage, { tileSize: 768, overlapPx: 2.5 }),
  createPluginRegistration(ZoomPluginPackage, { defaultZoomLevel: ZoomMode.FitPage }),
  createPluginRegistration(PanPluginPackage),
  createPluginRegistration(SelectionPluginPackage),
]

const BG_STYLE = {
  backgroundColor: 'oklch(0.18 0 0)',
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
  backgroundSize: '20px 20px',
}

interface CVPreviewProps {
  pdfBuffer: ArrayBuffer | null
  loading: boolean
}

export default function CVPreview({ pdfBuffer, loading }: CVPreviewProps) {
  const { engine, isLoading: engineLoading, error } = usePdfiumEngine({ worker: true })

  if (engineLoading || !engine) {
    return (
      <div className="flex h-full w-full items-center justify-center" style={BG_STYLE}>
        <CircleNotch className="animate-spin text-zinc-500" size={22} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500" style={BG_STYLE}>
        Failed to load PDF engine
      </div>
    )
  }

  return (
    <EmbedPDF engine={engine} plugins={plugins}>
      <CVPreviewViewer pdfBuffer={pdfBuffer} loading={loading} />
    </EmbedPDF>
  )
}

// — Toolbar —

const ZOOM_PRESETS = [50, 75, 100, 125, 150, 200]

function Toolbar({ documentId }: { documentId: string }) {
  const { state: zoomState, provides: zoomScope } = useZoom(documentId)
  const { provides: panScope, isPanning } = usePan(documentId)
  const [showPresets, setShowPresets] = useState(false)
  const presetsRef = useRef<HTMLDivElement>(null)
  const fitPageScaleRef = useRef<number | null>(null)

  useEffect(() => {
    if (!showPresets) return
    const handler = (e: MouseEvent) => {
      if (!presetsRef.current?.contains(e.target as Node)) setShowPresets(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showPresets])

  // H key toggles pan mode (Adobe Acrobat convention)
  useEffect(() => {
    if (!panScope) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'h' && e.key !== 'H') return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      panScope.togglePan()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [panScope])

  const zoomMode = zoomState?.zoomLevel
  const rawScale = zoomState?.currentZoomLevel ?? 1

  // Keep ref in sync with fit-page scale so 100% always = fit page
  if (zoomMode === ZoomMode.FitPage && rawScale > 0) {
    fitPageScaleRef.current = rawScale
  }
  const fitScale = fitPageScaleRef.current ?? rawScale
  const zoomPct = Math.round((rawScale / fitScale) * 100)

  const btn = (active: boolean) =>
    `flex h-7 w-7 items-center justify-center rounded-lg transition ${
      active ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-black/[0.06]'
    }`

  return (
    <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-xl border border-zinc-200 bg-white p-1 shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
      {/* Fit Width */}
      <button className={btn(zoomMode === ZoomMode.FitWidth)} onClick={() => zoomScope?.requestZoom(ZoomMode.FitWidth)} title="Fit width">
        <ArrowsHorizontal size={14} />
      </button>

      {/* Fit Page */}
      <button className={btn(zoomMode === ZoomMode.FitPage)} onClick={() => zoomScope?.requestZoom(ZoomMode.FitPage)} title="Fit page">
        <ArrowsOutSimple size={14} />
      </button>

      <div className="mx-0.5 h-4 w-px bg-zinc-200" />

      {/* Pan toggle */}
      <button className={btn(isPanning)} onClick={() => panScope?.togglePan()} title="Pan mode (H)">
        <Hand size={14} />
      </button>

      <div className="mx-0.5 h-4 w-px bg-zinc-200" />

      {/* Zoom out */}
      <button className={btn(false)} onClick={() => zoomScope?.zoomOut()} title="Zoom out">
        <Minus size={14} />
      </button>

      {/* Percentage + preset dropdown */}
      <div ref={presetsRef} className="relative">
        <button
          className="flex h-7 min-w-[48px] items-center justify-center rounded-lg px-1.5 text-xs tabular-nums text-zinc-500 transition hover:bg-black/[0.06]"
          onClick={() => setShowPresets((s) => !s)}
          title="Zoom presets"
        >
          {zoomPct}%
        </button>
        {showPresets && (
          <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 min-w-[72px] overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
            {ZOOM_PRESETS.map((p) => (
              <button
                key={p}
                className={`w-full px-4 py-1.5 text-left text-xs tabular-nums transition hover:bg-black/[0.06] ${
                  zoomPct === p ? 'font-semibold text-zinc-900' : 'text-zinc-500'
                }`}
                onClick={() => { zoomScope?.requestZoom((p / 100) * fitScale); setShowPresets(false) }}
              >
                {p}%
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom in */}
      <button className={btn(false)} onClick={() => zoomScope?.zoomIn()} title="Zoom in">
        <Plus size={14} />
      </button>
    </div>
  )
}

// — Copy tooltip shown on text selection —

function CopyTooltip({
  documentId,
  menuWrapperProps,
}: {
  documentId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuWrapperProps: any
}) {
  const { provides: selCap } = useSelectionCapability()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const scope = selCap?.forDocument(documentId)
    if (!scope) return
    scope.getSelectedText().wait((textArray: string[]) => {
      navigator.clipboard.writeText(textArray.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }, () => {})
  }

  return (
    <div {...menuWrapperProps}>
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto',
          whiteSpace: 'nowrap',
          zIndex: 10,
        }}
      >
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition hover:bg-zinc-50 active:scale-95"
        >
          <CopySimple size={11} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

// — Viewer —

function CVPreviewViewer({ pdfBuffer, loading }: CVPreviewProps) {
  const { provides: docManager } = useDocumentManagerCapability()
  const [documentId, setDocumentId] = useState<string | null>(null)
  const prevBufferRef = useRef<ArrayBuffer | null>(null)

  useEffect(() => {
    if (!docManager || !pdfBuffer) return
    if (pdfBuffer === prevBufferRef.current) return

    let cancelled = false

    ;(async () => {
      // Always close DOC_ID first. On first load this is a no-op (resolves immediately
      // when the document is not found). On subsequent loads this ensures the previous
      // document is fully removed before we open the same ID again.
      try { await docManager.closeDocument(DOC_ID).toPromise() } catch {}
      if (cancelled) return
      try {
        await docManager
          .openDocumentBuffer({ buffer: pdfBuffer, name: 'CV', documentId: DOC_ID })
          .toPromise()
      } catch (err) {
        console.error(err)
        return
      }
      if (cancelled) return
      // Only mark this buffer as loaded once the open actually succeeded.
      prevBufferRef.current = pdfBuffer
      setDocumentId(DOC_ID)
    })()

    return () => { cancelled = true }
  }, [pdfBuffer, docManager])

  return (
    <div className="relative h-full w-full select-none overflow-hidden" style={BG_STYLE}>
      {documentId ? (
        <DocumentContent documentId={documentId}>
          {({ isLoaded }) =>
            isLoaded ? (
              <GlobalPointerProvider documentId={documentId}>
                <Viewport documentId={documentId} className="h-full w-full" style={BG_STYLE}>
                  <ZoomGestureWrapper documentId={documentId} enableWheel enablePinch>
                    <Scroller
                      documentId={documentId}
                      renderPage={({ pageIndex }) => (
                        <PagePointerProvider documentId={documentId} pageIndex={pageIndex}>
                          <RenderLayer
                            documentId={documentId}
                            pageIndex={pageIndex}
                            scale={1}
                            style={{ pointerEvents: 'none' }}
                          />
                          <TilingLayer
                            documentId={documentId}
                            pageIndex={pageIndex}
                            style={{ pointerEvents: 'none' }}
                          />
                          <SelectionLayer
                            documentId={documentId}
                            pageIndex={pageIndex}
                            background="rgba(0, 0, 0, 0.12)"
                            selectionMenu={({ menuWrapperProps }) => (
                              <CopyTooltip documentId={documentId} menuWrapperProps={menuWrapperProps} />
                            )}
                          />
                        </PagePointerProvider>
                      )}
                    />
                  </ZoomGestureWrapper>
                </Viewport>
              </GlobalPointerProvider>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <CircleNotch className="animate-spin text-zinc-500" size={22} />
              </div>
            )
          }
        </DocumentContent>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <CircleNotch className="animate-spin text-zinc-500" size={22} />
        </div>
      )}

      {documentId && <Toolbar documentId={documentId} />}

      {loading && documentId && (
        <div className="absolute right-4 top-4 z-10 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <CircleNotch className="animate-spin text-zinc-500" size={14} />
        </div>
      )}
    </div>
  )
}

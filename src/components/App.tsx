import { useState, useRef, useEffect, useMemo, createElement, lazy, Suspense } from 'react'
import { usePDF } from '@react-pdf/renderer'
import type { DocumentProps } from '@react-pdf/renderer'
import useResizeObserver from '@react-hook/resize-observer'
import { Eye, Edit2 } from 'lucide-react'
import { useResumeStore } from '../store/resumeStore'
import { getTemplate } from '../templates'
import EditMenu from './EditMenu'
import { Toaster } from './ui/sonner'
import { Button } from './ui/button'

const CVPreview = lazy(() => import('./CVPreview'))

function App() {
  const resumeData = useResumeStore((s) => s.resumeData)
  const sectionsOrder = useResumeStore((s) => s.sectionsOrder)
  const viewMode = useResumeStore((s) => s.viewMode)
  const setViewMode = useResumeStore((s) => s.setViewMode)

  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  useResizeObserver(previewContainerRef, (entry) => {
    setContainerWidth(entry.contentRect.width)
    setContainerHeight(entry.contentRect.height)
  })

  const { renderer } = getTemplate(resumeData.templateId)

  const documentElement = useMemo(
    () =>
      createElement(renderer, {
        data: resumeData,
        options: resumeData.templateOptions,
        sectionsOrder,
        selectedSocial: resumeData.socialPlatform,
      }) as React.ReactElement<DocumentProps>,
    [resumeData, sectionsOrder, renderer],
  )

  const [pdfInstance, updatePDF] = usePDF({ document: documentElement })

  useEffect(() => {
    const id = setTimeout(() => updatePDF(documentElement), 400)
    return () => clearTimeout(id)
  }, [documentElement, updatePDF])

  return (
    <>
      <Toaster richColors />
      <div className="flex h-screen font-normal antialiased">
        <div
          className={`h-full w-full overflow-y-auto border-r border-zinc-200 bg-zinc-50 lg:w-[50%] ${
            viewMode === 'edit' ? 'block' : 'hidden'
          } lg:block`}
        >
          <EditMenu pdfInstance={pdfInstance} />
        </div>
        <div
          ref={previewContainerRef}
          className={`h-full w-full lg:w-[50%] ${
            viewMode === 'preview' ? 'block' : 'hidden'
          } lg:block`}
        >
          <Suspense fallback={null}>
            <CVPreview
              url={pdfInstance.url ?? null}
              loading={pdfInstance.loading}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
            />
          </Suspense>
        </div>
        <Button
          className="fixed bottom-5 right-5 z-40 gap-2 shadow-md lg:hidden"
          onClick={() =>
            setViewMode(viewMode === 'edit' ? 'preview' : 'edit')
          }
        >
          {viewMode === 'edit' ? (
            <>
              <Eye size={16} />
              <span>Preview</span>
            </>
          ) : (
            <>
              <Edit2 size={16} />
              <span>Edit</span>
            </>
          )}
        </Button>
      </div>
    </>
  )
}

export default App

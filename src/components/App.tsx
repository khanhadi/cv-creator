import { useState, useRef, useEffect, useMemo, createElement, lazy, Suspense } from 'react'
import { usePDF } from '@react-pdf/renderer'
import type { DocumentProps } from '@react-pdf/renderer'
import useResizeObserver from '@react-hook/resize-observer'
import { Eye, Edit2 } from 'lucide-react'
import { defaultResumeData } from '../defaultResumeData'
import type { ResumeData, Education, Experience, Project, CustomSection } from '../defaultResumeData'
import CVContent from './CVContent'

const CVPreview = lazy(() => import('./CVPreview'))
import EditMenu from './EditMenu'
import { Toaster } from './ui/sonner'
import { Button } from './ui/button'

export interface Handlers {
  inclusionHandler: (updated: Record<string, boolean>) => void
  resumeDataHandler: (
    eventOrData: React.ChangeEvent<HTMLInputElement> | ResumeData | null,
    clear?: boolean,
    reset?: boolean,
  ) => void
  socialHandler: (social: string) => void
  experienceHandler: (list: Experience[]) => void
  educationHandler: (list: Education[]) => void
  projectsHandler: (list: Project[]) => void
  sectionOrderHandler: (order: string[]) => void
  customSectionHandler: (data: CustomSection[]) => void
  deleteCustomSectionHandler: (sectionName: string) => void
}

const DEFAULT_SECTIONS_ORDER = ['education', 'professionalExperience', 'projects', 'Skills']

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  const saved = localStorage.getItem(key)
  return saved ? (JSON.parse(saved) as T) : fallback
}

function App() {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const [selectedSocial, setSelectedSocial] = useState('linkedin')
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  const [resumeData, setResumeData] = useState<ResumeData>(() =>
    loadFromStorage('resumeData', defaultResumeData),
  )

  const [sectionsOrder, setSectionsOrder] = useState<string[]>(() =>
    loadFromStorage('sectionsOrder', DEFAULT_SECTIONS_ORDER),
  )

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData))
  }, [resumeData])

  useEffect(() => {
    localStorage.setItem('sectionsOrder', JSON.stringify(sectionsOrder))
  }, [sectionsOrder])

  const previewContainerRef = useRef<HTMLDivElement>(null)

  useResizeObserver(previewContainerRef, (entry) => {
    setContainerWidth(entry.contentRect.width)
    setContainerHeight(entry.contentRect.height)
  })

  const documentElement = useMemo(
    () =>
      createElement(CVContent, {
        resumeData,
        selectedSocial,
        sectionsOrder,
      }) as React.ReactElement<DocumentProps>,
    [resumeData, selectedSocial, sectionsOrder],
  )

  const [pdfInstance, updatePDF] = usePDF({ document: documentElement })

  useEffect(() => {
    const id = setTimeout(() => updatePDF(documentElement), 400)
    return () => clearTimeout(id)
  }, [documentElement, updatePDF])

  function handleResumeData(
    eventOrData: React.ChangeEvent<HTMLInputElement> | ResumeData | null,
    clear = false,
    reset = false,
  ) {
    if (reset) {
      setResumeData(defaultResumeData)
      setSectionsOrder(DEFAULT_SECTIONS_ORDER)
      return
    }
    if (clear) {
      setSectionsOrder([])
      setResumeData({} as ResumeData)
      return
    }
    if (eventOrData && 'target' in eventOrData) {
      const { name, value } = eventOrData.target as HTMLInputElement
      setResumeData((prev) => ({ ...prev, [name]: value }))
    } else if (eventOrData && typeof eventOrData === 'object') {
      const data = eventOrData as ResumeData
      setResumeData(data)
      setSectionsOrder(Object.keys(data.includeSections))
    }
  }

  const handlers: Handlers = {
    inclusionHandler: (updated) =>
      setResumeData((prev) => ({ ...prev, includeSections: updated })),
    resumeDataHandler: handleResumeData,
    socialHandler: setSelectedSocial,
    experienceHandler: (list) =>
      setResumeData((prev) => ({ ...prev, experienceList: list })),
    educationHandler: (list) =>
      setResumeData((prev) => ({ ...prev, educationList: list })),
    projectsHandler: (list) =>
      setResumeData((prev) => ({ ...prev, projectsList: list })),
    sectionOrderHandler: setSectionsOrder,
    customSectionHandler: (data) =>
      setResumeData((prev) => ({ ...prev, customSectionData: data })),
    deleteCustomSectionHandler: (sectionName) => {
      setSectionsOrder((prev) => prev.filter((s) => s !== sectionName))
      setResumeData((prev) => {
        const includeSections = { ...prev.includeSections }
        delete includeSections[sectionName]
        return {
          ...prev,
          includeSections,
          customSectionData: prev.customSectionData.filter(
            (s) => s.title !== sectionName,
          ),
        }
      })
    },
  }

  return (
    <>
      <Toaster richColors />
      <div className="flex h-screen font-normal antialiased">
        <div
          className={`h-full w-full overflow-y-auto border-r border-zinc-200 bg-zinc-50 lg:w-[50%] ${
            viewMode === 'edit' ? 'block' : 'hidden'
          } lg:block`}
        >
          <EditMenu
            resumeData={resumeData}
            selectedSocial={selectedSocial}
            sectionsOrder={sectionsOrder}
            pdfInstance={pdfInstance}
            handlers={handlers}
          />
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
          onClick={() => setViewMode((v) => (v === 'edit' ? 'preview' : 'edit'))}
        >
          {viewMode === 'edit' ? (
            <><Eye size={16} /><span>Preview</span></>
          ) : (
            <><Edit2 size={16} /><span>Edit</span></>
          )}
        </Button>
      </div>
    </>
  )
}

export default App

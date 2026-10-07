import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CaretDown, DownloadSimple, Eye, EyeSlash, DotsSixVertical, CircleNotch, Trash } from '@phosphor-icons/react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import ResumeDataTools from './ui/ResumeDataTools'
import { SortableSectionItem } from './ui/SortableSectionItem'
import SocialInput from './ui/SocialInput'
import { SectionEditor } from './ui/SectionEditor'
import type { FieldDef, SectionItem } from './ui/SectionEditor'
import AddCustomSection from './ui/AddCustomSection'
import DesignTab from './DesignTab'
import { useResumeStore } from '../store/resumeStore'
import type {
  Education,
  Experience,
  Project,
  CustomSectionItem,
} from '../defaultResumeData'

interface PDFInstance {
  loading: boolean
  url: string | null
  error: string | null
}

interface EditMenuProps {
  pdfInstance: PDFInstance
}

// ── Field configs ──────────────────────────────────────────────────────────

const EDUCATION_FIELDS: FieldDef[] = [
  { name: 'institutionName', label: 'Institution', type: 'text', placeholder: 'University name', previewPrimary: true, span: 'half' },
  { name: 'date', label: 'Date', type: 'text', placeholder: 'Sep 2020 - Jun 2024', span: 'half' },
  { name: 'courseTitle', label: 'Course / Degree', type: 'text', placeholder: 'Degree / course', previewSecondary: true, span: 'half' },
  { name: 'grade', label: 'Grade', type: 'text', placeholder: 'First Class', span: 'half' },
  { name: 'description', label: 'Description', type: 'richtext', span: 'full' },
]
const DEFAULT_EDUCATION: Omit<Education, 'id'> = {
  institutionName: '', courseTitle: '', date: '', grade: '', description: '',
}

const EXPERIENCE_FIELDS: FieldDef[] = [
  { name: 'companyName', label: 'Company', type: 'text', placeholder: 'Company name', previewPrimary: true, span: 'half' },
  { name: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'Role', previewSecondary: true, span: 'half' },
  { name: 'description', label: 'Description', type: 'richtext', span: 'full' },
  { name: 'date', label: 'Date', type: 'text', placeholder: 'Jun 2023 - Sep 2023', span: 'half' },
  { name: 'location', label: 'Location', type: 'text', placeholder: 'London, UK', span: 'half' },
  { name: 'skills', label: 'Skills', type: 'skills', span: 'full' },
]
const DEFAULT_EXPERIENCE: Omit<Experience, 'id'> = {
  companyName: '', jobTitle: '', date: '', location: '', skills: [], description: '',
}

const PROJECTS_FIELDS: FieldDef[] = [
  { name: 'projectName', label: 'Project Name', type: 'text', placeholder: 'Project name', previewPrimary: true, span: 'half' },
  { name: 'subHeading', label: 'Sub Heading', type: 'text', placeholder: 'One-liner', previewSecondary: true, span: 'half' },
  { name: 'description', label: 'Description', type: 'richtext', span: 'full' },
  { name: 'link', label: 'Project Link', type: 'text', placeholder: 'https://...', span: 'half' },
  { name: 'date', label: 'Date', type: 'text', placeholder: 'Jan 2023 - Apr 2023', span: 'half' },
]
const DEFAULT_PROJECT: Omit<Project, 'id'> = {
  projectName: '', subHeading: '', description: '', date: '', link: '',
}

const CUSTOM_SECTION_FIELDS: FieldDef[] = [
  { name: 'heading', label: 'Heading', type: 'text', placeholder: 'Heading', previewPrimary: true, span: 'half' },
  { name: 'subHeading', label: 'Sub Heading', type: 'text', placeholder: 'Sub heading', previewSecondary: true, span: 'half' },
  { name: 'description', label: 'Description', type: 'richtext', span: 'full' },
  { name: 'date', label: 'Date', type: 'text', placeholder: 'Date', span: 'half' },
  { name: 'additionalInfo', label: 'Additional Info', type: 'text', placeholder: 'Extra info', span: 'half' },
]
const DEFAULT_CUSTOM_ITEM: Omit<CustomSectionItem, 'id'> = {
  heading: '', subHeading: '', description: '', date: '', additionalInfo: '',
}

// ── SectionShell ───────────────────────────────────────────────────────────

interface SectionShellProps {
  title: string
  included?: boolean
  onIncludeToggle?: () => void
  onDelete?: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLElement>
  defaultOpen?: boolean
  children: React.ReactNode
}

function SectionShell({
  title,
  included,
  onIncludeToggle,
  onDelete,
  dragHandleProps,
  defaultOpen = false,
  children,
}: SectionShellProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const isHidden = onIncludeToggle !== undefined && included === false

  return (
    <div className={cn(
      'mt-2 overflow-hidden rounded-xl bg-white transition-shadow',
      isHidden
        ? 'opacity-50 shadow-sm'
        : 'shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_16px_rgba(0,0,0,0.06)]',
    )}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3.5 transition-colors hover:bg-zinc-50"
      >
        {dragHandleProps && (
          <span
            className="flex shrink-0 cursor-grab items-center text-zinc-500 hover:text-zinc-700 active:cursor-grabbing"
            aria-label="Drag to reorder"
            onClick={(e) => e.stopPropagation()}
            {...dragHandleProps}
          >
            <DotsSixVertical size={14} />
          </span>
        )}
        {onIncludeToggle && (
          <button
            type="button"
            aria-label={included ? 'Hide from PDF' : 'Show in PDF'}
            onClick={(e) => { e.stopPropagation(); onIncludeToggle() }}
            className={cn(
              'flex shrink-0 items-center transition-colors',
              included ? 'text-zinc-400 hover:text-zinc-600' : 'text-zinc-300 hover:text-zinc-500',
            )}
          >
            {included ? <Eye size={14} /> : <EyeSlash size={14} />}
          </button>
        )}
        <span className={cn(
          'flex-1 cursor-pointer text-left text-sm font-medium',
          isHidden ? 'text-zinc-400' : 'text-zinc-900',
        )}>
          {title}
        </span>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${title} section`}
            className="size-6 shrink-0 text-zinc-400 hover:text-red-500 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash size={12} />
          </Button>
        )}
        <CaretDown
          size={16}
          aria-hidden="true"
          className={cn(
            'shrink-0 text-zinc-400 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </div>
      {isOpen && (
        <div className="border-t border-zinc-100 bg-zinc-50 px-3 pb-4 pt-3">{children}</div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function EditMenu({ pdfInstance }: EditMenuProps) {
  const resumeData = useResumeStore((s) => s.resumeData)
  const sectionsOrder = useResumeStore((s) => s.sectionsOrder)
  const setField = useResumeStore((s) => s.setField)
  const setSectionsOrder = useResumeStore((s) => s.setSectionsOrder)
  const deleteCustomSection = useResumeStore((s) => s.deleteCustomSection)

  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    sectionName: string | null
  }>({ isOpen: false, sectionName: null })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const onIncludeChange = (sectionName: string) => {
    setField('includeSections', {
      ...resumeData.includeSections,
      [sectionName]: !resumeData.includeSections[sectionName],
    })
  }

  const onCustomSectionUpdate = (
    title: string,
    items: CustomSectionItem[],
  ) => {
    const updated = resumeData.customSectionData.map((s) =>
      s.title === title ? { ...s, items } : s,
    )
    setField('customSectionData', updated)
  }

  function renderSection(sectionName: string, dragHandleProps?: React.HTMLAttributes<HTMLElement>) {
    switch (sectionName) {
      case 'professionalExperience':
        return (
          <SectionShell
            title="Professional Experience"
            included={resumeData.includeSections.professionalExperience}
            onIncludeToggle={() => onIncludeChange('professionalExperience')}
            dragHandleProps={dragHandleProps}
          >
            <SectionEditor
              items={resumeData.experienceList as unknown as SectionItem[]}
              fields={EXPERIENCE_FIELDS}
              defaultItem={DEFAULT_EXPERIENCE as SectionItem}
              itemLabel="Experience"
              onUpdate={(items) => setField('experienceList', items as unknown as Experience[])}
            />
          </SectionShell>
        )

      case 'education':
        return (
          <SectionShell
            title="Education"
            included={resumeData.includeSections.education}
            onIncludeToggle={() => onIncludeChange('education')}
            dragHandleProps={dragHandleProps}
          >
            <SectionEditor
              items={resumeData.educationList as unknown as SectionItem[]}
              fields={EDUCATION_FIELDS}
              defaultItem={DEFAULT_EDUCATION as SectionItem}
              itemLabel="Education"
              onUpdate={(items) => setField('educationList', items as unknown as Education[])}
            />
          </SectionShell>
        )

      case 'projects':
        return (
          <SectionShell
            title="Projects"
            included={resumeData.includeSections.projects}
            onIncludeToggle={() => onIncludeChange('projects')}
            dragHandleProps={dragHandleProps}
          >
            <SectionEditor
              items={resumeData.projectsList as unknown as SectionItem[]}
              fields={PROJECTS_FIELDS}
              defaultItem={DEFAULT_PROJECT as SectionItem}
              itemLabel="Project"
              onUpdate={(items) => setField('projectsList', items as unknown as Project[])}
            />
          </SectionShell>
        )

      default: {
        const sectionData = resumeData.customSectionData.find(
          (s) => s.title === sectionName,
        )
        return (
          <SectionShell
            title={sectionName}
            included={resumeData.includeSections[sectionName]}
            onIncludeToggle={() => onIncludeChange(sectionName)}
            onDelete={() =>
              setDeleteModal({ isOpen: true, sectionName })
            }
            dragHandleProps={dragHandleProps}
          >
            <SectionEditor
              items={(sectionData?.items ?? []) as unknown as SectionItem[]}
              fields={CUSTOM_SECTION_FIELDS}
              defaultItem={DEFAULT_CUSTOM_ITEM as SectionItem}
              itemLabel="Item"
              onUpdate={(items) => onCustomSectionUpdate(sectionName, items as unknown as CustomSectionItem[])}
            />
          </SectionShell>
        )
      }
    }
  }

  const inputClass =
    'flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-black/[0.06]'

  return (
    <div className="flex h-full flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 border-b border-zinc-100 bg-white">
        <div className="flex items-center justify-between px-5 pt-4 pb-0">
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-900">
              cv<span className="font-medium text-zinc-400">creator</span>
            </h1>
            <p className="mt-0.5 text-[11px] text-zinc-400">
              by{' '}
              <a
                href="https://khanhadi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-800"
              >
                khanhadi
              </a>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pdfInstance.loading ? (
              <CircleNotch size={15} className="animate-spin text-zinc-400" />
            ) : pdfInstance.url ? (
              <a href={pdfInstance.url} download="CV.pdf">
                <Button size="sm" className="gap-1.5">
                  <DownloadSimple size={13} />
                  Download
                </Button>
              </a>
            ) : null}
          </div>
        </div>

        {/* Tab bar */}
        <div className="mt-3 flex">
          {(['content', 'design'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'border-b-2 px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-colors',
                activeTab === tab
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'content' && (
          <div className="px-5 py-4">
            {/* Tools row */}
            <div className="mb-3">
              <ResumeDataTools />
            </div>

            {/* Personal Information */}
            <SectionShell
              title="Personal Information"
              defaultOpen
            >
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex w-full flex-col gap-1.5 sm:w-1/2">
                    <label className="text-xs font-medium text-zinc-400">
                      Name
                    </label>
                    <input
                      value={resumeData.fullName}
                      onChange={(e) => setField('fullName', e.target.value)}
                      type="text"
                      placeholder="Full name"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-1.5 sm:w-1/2">
                    <label className="text-xs font-medium text-zinc-400">
                      Mobile
                    </label>
                    <input
                      value={resumeData.mobileNo}
                      onChange={(e) => setField('mobileNo', e.target.value)}
                      type="text"
                      placeholder="+44 7000 000000"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-400">Email</label>
                  <input
                    value={resumeData.email}
                    onChange={(e) => setField('email', e.target.value)}
                    type="text"
                    placeholder="email@example.com"
                    className={inputClass}
                  />
                </div>
                <SocialInput />
              </div>
            </SectionShell>

            {/* Sections */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={({ active, over }) => {
                if (over && active.id !== over.id) {
                  const oldIndex = sectionsOrder.indexOf(String(active.id))
                  const newIndex = sectionsOrder.indexOf(String(over.id))
                  setSectionsOrder(arrayMove(sectionsOrder, oldIndex, newIndex))
                }
              }}
            >
              <SortableContext
                items={sectionsOrder}
                strategy={verticalListSortingStrategy}
              >
                {sectionsOrder.map((section) => (
                  <SortableSectionItem key={section} id={section}>
                    {(dragHandleProps) => renderSection(section, dragHandleProps)}
                  </SortableSectionItem>
                ))}
              </SortableContext>
            </DndContext>

            {/* Add custom section */}
            <div className="mt-2 rounded-xl border border-dashed border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300">
              <AddCustomSection />
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="px-5 py-4">
            <DesignTab />
          </div>
        )}
      </div>

      {/* Delete section dialog */}
      <Dialog
        open={deleteModal.isOpen}
        onOpenChange={(open) =>
          !open && setDeleteModal({ isOpen: false, sectionName: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete section</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-zinc-900">
              {deleteModal.sectionName}
            </span>
            ? This cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModal({ isOpen: false, sectionName: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (deleteModal.sectionName) {
                  deleteCustomSection(deleteModal.sectionName)
                }
                setDeleteModal({ isOpen: false, sectionName: null })
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

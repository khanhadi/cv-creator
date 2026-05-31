import { useState } from 'react'
import { Reorder } from 'framer-motion'
import { ChevronDown, Download, Loader2, Trash2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import ResumeDataTools from './ui/ResumeDataTools'
import DraggableItem from './ui/DraggableItem'
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
  { name: 'description', label: 'Description', type: 'textarea', span: 'full' },
]
const DEFAULT_EDUCATION: Omit<Education, 'id'> = {
  institutionName: '', courseTitle: '', date: '', grade: '', description: '',
}

const EXPERIENCE_FIELDS: FieldDef[] = [
  { name: 'companyName', label: 'Company', type: 'text', placeholder: 'Company name', previewPrimary: true, span: 'half' },
  { name: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'Role', previewSecondary: true, span: 'half' },
  { name: 'description', label: 'Description', type: 'textarea', span: 'full' },
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
  { name: 'description', label: 'Description', type: 'textarea', span: 'full' },
  { name: 'link', label: 'Project Link', type: 'text', placeholder: 'https://...', span: 'half' },
  { name: 'date', label: 'Date', type: 'text', placeholder: 'Jan 2023 - Apr 2023', span: 'half' },
]
const DEFAULT_PROJECT: Omit<Project, 'id'> = {
  projectName: '', subHeading: '', description: '', date: '', link: '',
}

const CUSTOM_SECTION_FIELDS: FieldDef[] = [
  { name: 'heading', label: 'Heading', type: 'text', placeholder: 'Heading', previewPrimary: true, span: 'half' },
  { name: 'subHeading', label: 'Sub Heading', type: 'text', placeholder: 'Sub heading', previewSecondary: true, span: 'half' },
  { name: 'description', label: 'Description', type: 'textarea', span: 'full' },
  { name: 'date', label: 'Date', type: 'text', placeholder: 'Date', span: 'half' },
  { name: 'additionalInfo', label: 'Additional Info', type: 'text', placeholder: 'Extra info', span: 'half' },
]
const DEFAULT_CUSTOM_ITEM: Omit<CustomSectionItem, 'id'> = {
  heading: '', subHeading: '', description: '', date: '', additionalInfo: '',
}

// ── SectionShell ───────────────────────────────────────────────────────────

interface SectionShellProps {
  title: string
  checked?: boolean
  onCheckedChange?: () => void
  onDelete?: () => void
  isReordering: boolean
  defaultOpen?: boolean
  children: React.ReactNode
}

function SectionShell({
  title,
  checked,
  onCheckedChange,
  onDelete,
  isReordering,
  defaultOpen = false,
  children,
}: SectionShellProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className={cn(
        'mt-1 overflow-hidden rounded-lg border border-zinc-200 bg-white',
        isReordering && 'rounded-tl-none',
      )}
    >
      <div className="flex items-center gap-2 px-3 py-3">
        {onCheckedChange && (
          <Checkbox
            checked={checked}
            onCheckedChange={onCheckedChange}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0"
          />
        )}
        <button
          type="button"
          className="flex-1 text-left text-base font-medium text-zinc-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
        </button>
        {onDelete && (
          <Button
            variant="destructive"
            size="icon"
            className="size-7 shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 size={13} />
          </Button>
        )}
        <ChevronDown
          size={18}
          className={cn(
            'shrink-0 cursor-pointer text-zinc-400 transition-transform',
            isOpen && 'rotate-180',
          )}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <div className="border-t border-zinc-100 px-3 pb-3 pt-2">{children}</div>
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
  const [reorderToggle, setReorderToggle] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    sectionName: string | null
  }>({ isOpen: false, sectionName: null })

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

  function renderSection(sectionName: string) {
    switch (sectionName) {
      case 'professionalExperience':
        return (
          <SectionShell
            title="Professional Experience"
            checked={resumeData.includeSections.professionalExperience}
            onCheckedChange={() => onIncludeChange('professionalExperience')}
            isReordering={reorderToggle}
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
            checked={resumeData.includeSections.education}
            onCheckedChange={() => onIncludeChange('education')}
            isReordering={reorderToggle}
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
            checked={resumeData.includeSections.projects}
            onCheckedChange={() => onIncludeChange('projects')}
            isReordering={reorderToggle}
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
            checked={resumeData.includeSections[sectionName]}
            onCheckedChange={() => onIncludeChange(sectionName)}
            onDelete={() =>
              setDeleteModal({ isOpen: true, sectionName })
            }
            isReordering={reorderToggle}
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

  return (
    <div className="flex h-full flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 border-b border-zinc-200 bg-zinc-50">
        <div className="flex items-center justify-between px-4 pt-4 pb-0">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
              cv<span className="text-primary">creator</span>
            </h1>
            <p className="text-xs text-zinc-400">
              by{' '}
              <a
                href="https://khanhadi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:opacity-80"
              >
                khanhadi
              </a>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pdfInstance.loading ? (
              <Loader2 size={15} className="animate-spin text-zinc-400" />
            ) : pdfInstance.url ? (
              <a href={pdfInstance.url} download="CV.pdf">
                <Button size="sm" className="gap-1.5">
                  <Download size={13} />
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
                'border-b-2 px-4 py-2 text-sm font-medium capitalize transition-colors',
                activeTab === tab
                  ? 'border-primary text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700',
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
          <div className="px-4 py-4">
            {/* Tools + reorder toggle */}
            <div className="mb-3 flex items-center justify-between">
              <ResumeDataTools />
              <div className="flex items-center gap-2">
                <label className="cursor-pointer text-sm text-zinc-500">
                  Reorder
                </label>
                <button
                  onClick={() => setReorderToggle((v) => !v)}
                  className={cn(
                    'relative inline-flex h-5 w-9 items-center rounded-full border-2 border-transparent transition-colors focus:outline-none',
                    reorderToggle ? 'bg-primary' : 'bg-zinc-200',
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                      reorderToggle ? 'translate-x-4' : 'translate-x-0',
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <SectionShell
              title="Personal Information"
              defaultOpen
              isReordering={false}
            >
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex w-full flex-col gap-1 sm:w-1/2">
                    <label className="text-sm font-medium text-zinc-700">
                      Name
                    </label>
                    <input
                      value={resumeData.fullName}
                      onChange={(e) => setField('fullName', e.target.value)}
                      type="text"
                      placeholder="Full name"
                      className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-1 sm:w-1/2">
                    <label className="text-sm font-medium text-zinc-700">
                      Mobile No.
                    </label>
                    <input
                      value={resumeData.mobileNo}
                      onChange={(e) => setField('mobileNo', e.target.value)}
                      type="text"
                      placeholder="+44 7000 000000"
                      className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex w-full flex-col gap-1 sm:w-1/2">
                    <label className="text-sm font-medium text-zinc-700">
                      Email
                    </label>
                    <input
                      value={resumeData.email}
                      onChange={(e) => setField('email', e.target.value)}
                      type="text"
                      placeholder="email@example.com"
                      className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <SocialInput />
                  </div>
                </div>
              </div>
            </SectionShell>

            {/* Sections */}
            <Reorder.Group
              axis="y"
              values={sectionsOrder}
              onReorder={setSectionsOrder}
            >
              {sectionsOrder.map((section) => (
                <DraggableItem
                  key={section}
                  item={section}
                  renderSection={renderSection}
                  isReorderingEnabled={reorderToggle}
                />
              ))}
            </Reorder.Group>

            {/* Add custom section */}
            <div className="mt-1 rounded-lg border border-dashed border-zinc-300 bg-white p-4">
              <AddCustomSection />
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="px-4 py-4">
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

import { useState } from 'react'
import { Reorder } from 'framer-motion'
import { ChevronDown, Loader2, Trash2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
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
import EducationCard from './ui/cards/EducationCard'
import ProfessionCard from './ui/cards/ProfessionCard'
import ProjectsCard from './ui/cards/ProjectsCard'
import AddCustomSection from './ui/AddCustomSection'
import CustomSectionCard from './ui/cards/CustomSectionCard'
import type { ResumeData } from '../defaultResumeData'
import type { Handlers } from './App'

interface PDFInstance {
  loading: boolean
  url: string | null
  error: string | null
}

interface EditMenuProps {
  resumeData: ResumeData
  selectedSocial: string
  sectionsOrder: string[]
  pdfInstance: PDFInstance
  handlers: Handlers
}

interface SectionShellProps {
  title: string
  checked?: boolean
  onCheckedChange?: () => void
  onDelete?: () => void
  reorderToggle: boolean
  defaultOpen?: boolean
  children: React.ReactNode
}

interface UiState {
  reorderToggle: boolean
  loadedFile: string
}

function SectionShell({
  title,
  checked,
  onCheckedChange,
  onDelete,
  reorderToggle,
  defaultOpen = false,
  children,
}: SectionShellProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className={cn(
        'mt-1 overflow-hidden rounded-lg border border-zinc-200 bg-white',
        reorderToggle && 'rounded-tl-none',
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

export default function EditMenu({
  resumeData,
  selectedSocial,
  sectionsOrder,
  pdfInstance,
  handlers,
}: EditMenuProps) {
  const {
    inclusionHandler,
    resumeDataHandler,
    socialHandler,
    experienceHandler,
    educationHandler,
    projectsHandler,
    sectionOrderHandler,
    customSectionHandler,
    deleteCustomSectionHandler,
  } = handlers

  const [uiState, setUiState] = useState<UiState>({
    reorderToggle: false,
    loadedFile: '',
  })
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    sectionName: string | null
  }>({ isOpen: false, sectionName: null })

  const onIncludeChange = (sectionName: string) => {
    inclusionHandler({
      ...resumeData.includeSections,
      [sectionName]: !resumeData.includeSections[sectionName],
    })
  }

  const onCustomSectionDataUpdate = (updatedData: {
    title: string
    items: ResumeData['customSectionData'][number]['items']
  }) => {
    const { title, items } = updatedData
    let sectionExists = false
    const updated = resumeData.customSectionData.map((section) => {
      if (section.title === title) {
        sectionExists = true
        return { ...section, items }
      }
      return section
    })
    if (!sectionExists) updated.push({ title, items })
    customSectionHandler(updated)
  }

  const getCustomSectionData = (sectionTitle: string) => {
    return (
      resumeData.customSectionData.find((s) => s.title === sectionTitle) ?? {
        title: sectionTitle,
        items: [],
      }
    )
  }

  function renderSection(sectionName: string) {
    const { reorderToggle } = uiState

    switch (sectionName) {
      case 'personalInformation':
        return (
          <SectionShell
            title="Personal Information"
            defaultOpen
            reorderToggle={reorderToggle}
          >
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex w-full flex-col gap-1 sm:w-1/2">
                  <label className="text-sm font-medium text-zinc-700">Name</label>
                  <input
                    name="fullName"
                    value={resumeData.fullName}
                    onChange={resumeDataHandler}
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
                    name="mobileNo"
                    value={resumeData.mobileNo}
                    onChange={resumeDataHandler}
                    type="text"
                    placeholder="+44 7000 000000"
                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex w-full flex-col gap-1 sm:w-1/2">
                  <label className="text-sm font-medium text-zinc-700">Email</label>
                  <input
                    name="email"
                    value={resumeData.email}
                    onChange={resumeDataHandler}
                    type="text"
                    placeholder="email@example.com"
                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <SocialInput
                    socialLink={resumeData.socialLink}
                    resumeDataHandler={resumeDataHandler}
                    socialHandler={socialHandler}
                    selectedSocial={selectedSocial}
                  />
                </div>
              </div>
            </div>
          </SectionShell>
        )

      case 'professionalExperience':
        return (
          <SectionShell
            title="Professional Experience"
            checked={resumeData.includeSections.professionalExperience}
            onCheckedChange={() => onIncludeChange('professionalExperience')}
            reorderToggle={reorderToggle}
          >
            <ProfessionCard
              experienceList={resumeData.experienceList}
              onExperienceUpdate={experienceHandler}
            />
          </SectionShell>
        )

      case 'education':
        return (
          <SectionShell
            title="Education"
            checked={resumeData.includeSections.education}
            onCheckedChange={() => onIncludeChange('education')}
            reorderToggle={reorderToggle}
          >
            <EducationCard
              educationList={resumeData.educationList}
              onEducationUpdate={educationHandler}
            />
          </SectionShell>
        )

      case 'projects':
        return (
          <SectionShell
            title="Projects"
            checked={resumeData.includeSections.projects}
            onCheckedChange={() => onIncludeChange('projects')}
            reorderToggle={reorderToggle}
          >
            <ProjectsCard
              projectsList={resumeData.projectsList}
              onProjectsUpdate={projectsHandler}
            />
          </SectionShell>
        )

      default: {
        const customSection = sectionsOrder.find((s) => s === sectionName)
        if (!customSection) return null
        const sectionData = getCustomSectionData(customSection)
        return (
          <SectionShell
            title={customSection}
            checked={resumeData.includeSections[sectionName]}
            onCheckedChange={() => onIncludeChange(sectionName)}
            onDelete={() => setDeleteModal({ isOpen: true, sectionName })}
            reorderToggle={reorderToggle}
          >
            <CustomSectionCard
              sectionTitle={customSection}
              sectionItemsList={sectionData.items}
              onSectionUpdate={onCustomSectionDataUpdate}
            />
          </SectionShell>
        )
      }
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-5">
      <div className="mb-24">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3 border-b border-zinc-200 pb-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
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

          <div className="ml-auto flex items-center gap-2">
            {pdfInstance.loading ? (
              <Loader2 size={16} className="animate-spin text-zinc-400" />
            ) : pdfInstance.url ? (
              <a href={pdfInstance.url} download="CV.pdf">
                <Button size="sm">Download PDF</Button>
              </a>
            ) : null}
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-3 flex items-center gap-2">
          <ResumeDataTools
            resumeData={resumeData}
            resumeDataHandler={resumeDataHandler}
            uiState={uiState}
            setUiState={setUiState}
            handlers={handlers}
          />
          <div className="ml-auto flex items-center gap-2">
            <label className="cursor-pointer text-sm text-zinc-500">Reorder</label>
            <Switch
              checked={uiState.reorderToggle}
              onCheckedChange={(checked) =>
                setUiState((prev) => ({ ...prev, reorderToggle: checked }))
              }
            />
          </div>
        </div>

        {/* Sections */}
        {renderSection('personalInformation')}

        <Reorder.Group
          axis="y"
          values={sectionsOrder}
          onReorder={sectionOrderHandler}
        >
          {sectionsOrder.map((section) => (
            <DraggableItem
              key={section}
              item={section}
              renderSection={renderSection}
              isReorderingEnabled={uiState.reorderToggle}
            />
          ))}
        </Reorder.Group>

        {/* Add custom section */}
        <div className="mt-1 rounded-lg border border-zinc-200 bg-white p-4">
          <AddCustomSection
            sectionsOrder={sectionsOrder}
            inclusionObject={resumeData.includeSections}
            handleSectionOrder={sectionOrderHandler}
            handleInclusion={inclusionHandler}
            handleSectionData={onCustomSectionDataUpdate}
          />
        </div>
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
                  deleteCustomSectionHandler(deleteModal.sectionName)
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

import { useState, useCallback, useEffect } from 'react'
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
import { DotsSixVertical, Plus } from '@phosphor-icons/react'
import { v4 as uuidv4 } from 'uuid'
import { cn } from '../../lib/utils'
import { Button } from './button'
import { SortableCardItem } from './SortableCardItem'
import SkillsInput from './SkillsInput'
import RichTextInput from './RichTextInput'

export type FieldType = 'text' | 'textarea' | 'skills' | 'richtext'

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  previewPrimary?: boolean
  previewSecondary?: boolean
  span?: 'full' | 'half'
}

export type SectionItem = Record<string, string | string[] | undefined> & { id?: string }

interface SectionEditorProps {
  items: SectionItem[]
  fields: FieldDef[]
  defaultItem: SectionItem
  itemLabel: string
  onUpdate: (items: SectionItem[]) => void
}

const inputClass =
  'flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-black/[0.06]'
const textareaClass =
  'flex min-h-[80px] w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-black/[0.06]'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-zinc-400">{label}</label>
      {children}
    </div>
  )
}

function groupIntoRows(fields: FieldDef[]): FieldDef[][] {
  const rows: FieldDef[][] = []
  let currentRow: FieldDef[] = []

  for (const field of fields) {
    if (field.span === 'full') {
      if (currentRow.length > 0) {
        rows.push(currentRow)
        currentRow = []
      }
      rows.push([field])
    } else {
      currentRow.push(field)
      if (currentRow.length === 2) {
        rows.push(currentRow)
        currentRow = []
      }
    }
  }
  if (currentRow.length > 0) rows.push(currentRow)
  return rows
}

export function SectionEditor({
  items,
  fields,
  defaultItem,
  itemLabel,
  onUpdate,
}: SectionEditorProps) {
  const ensureId = (item: SectionItem): SectionItem =>
    item.id ? item : { ...item, id: uuidv4() }

  const [list, setList] = useState<SectionItem[]>(() => items.map(ensureId))
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<SectionItem>(defaultItem)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  useEffect(() => {
    setList(items.map(ensureId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  const handleFieldChange = useCallback(
    (name: string, value: string | string[]) => {
      setFormData((prev) => ({ ...prev, [name]: value }))
    },
    [],
  )

  const save = () => {
    const isEdit = editIndex !== null && editIndex < list.length
    const updated: SectionItem[] = isEdit
      ? list.map((item, i) =>
          i === editIndex ? { ...formData, id: item.id } : item,
        )
      : [...list, { ...formData, id: uuidv4() }]
    setList(updated)
    onUpdate(updated)
    setTimeout(() => {
      setEditIndex(null)
      setFormData(defaultItem)
    }, 10)
  }

  const cancel = () => {
    setEditIndex(null)
    setFormData(defaultItem)
  }

  const del = () => {
    const updated = list.filter((_, i) => i !== editIndex)
    setList(updated)
    onUpdate(updated)
    setTimeout(() => {
      setEditIndex(null)
      setFormData(defaultItem)
    }, 10)
  }

  const primaryField = fields.find((f) => f.previewPrimary)
  const secondaryField = fields.find((f) => f.previewSecondary)

  function renderFieldInput(field: FieldDef) {
    const value = formData[field.name]

    if (field.type === 'skills') {
      return (
        <Field key={field.name} label={field.label}>
          <SkillsInput
            value={(value as string[]) ?? []}
            onChange={(skills) => handleFieldChange(field.name, skills)}
          />
        </Field>
      )
    }

    if (field.type === 'richtext') {
      return (
        <Field key={field.name} label={field.label}>
          <RichTextInput
            key={`rt-${editIndex}-${field.name}`}
            value={(value as string) ?? ''}
            onChange={(html) => handleFieldChange(field.name, html)}
          />
        </Field>
      )
    }

    if (field.type === 'textarea') {
      return (
        <Field key={field.name} label={field.label}>
          <textarea
            name={field.name}
            value={(value as string) ?? ''}
            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
            placeholder={field.placeholder ?? '...'}
            className={textareaClass}
          />
        </Field>
      )
    }

    return (
      <Field key={field.name} label={field.label}>
        <input
          name={field.name}
          value={(value as string) ?? ''}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          placeholder={field.placeholder ?? ''}
          className={inputClass}
        />
      </Field>
    )
  }

  function renderForm(mode: 'edit' | 'add') {
    const rows = groupIntoRows(fields)
    return (
      <div className="p-2">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {mode === 'edit' ? `Edit ${itemLabel}` : `New ${itemLabel}`}
        </p>
        <div className="flex flex-col gap-2">
          {rows.map((row, rowIdx) =>
            row.length === 1 ? (
              <div key={rowIdx}>{renderFieldInput(row[0])}</div>
            ) : (
              <div key={rowIdx} className="flex flex-col gap-2">
                {row.map((field) => (
                  <div key={field.name} className="w-full">
                    {renderFieldInput(field)}
                  </div>
                ))}
              </div>
            ),
          )}
        </div>
        <div className="mt-3 flex justify-end gap-1.5">
          {mode === 'edit' && (
            <Button
              variant="ghost"
              size="sm"
              className="mr-auto text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={del}
            >
              Delete
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={cancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={save}>
            {mode === 'edit' ? 'Save' : 'Add'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={({ active, over }) => {
          if (over && active.id !== over.id) {
            const oldIndex = list.findIndex((i) => i.id === String(active.id))
            const newIndex = list.findIndex((i) => i.id === String(over.id))
            const updated = arrayMove(list, oldIndex, newIndex)
            setList(updated)
            onUpdate(updated)
          }
        }}
      >
        <SortableContext
          items={list.map((i) => i.id!)}
          strategy={verticalListSortingStrategy}
        >
          {list.map((item, index) => (
            <SortableCardItem key={item.id} id={item.id!}>
              {(dragHandleProps) => (
                <div className={cn(
                  'mt-2 overflow-hidden rounded-lg border border-zinc-100 bg-white transition-shadow',
                )}>
                  {editIndex === index ? (
                    renderForm('edit')
                  ) : (
                    <div className="flex items-center transition-colors hover:bg-zinc-100">
                      <span
                        className="flex cursor-grab items-center self-stretch px-3 text-zinc-500 hover:text-zinc-700 active:cursor-grabbing"
                        aria-label="Drag to reorder"
                        {...dragHandleProps}
                      >
                        <DotsSixVertical size={14} className="shrink-0" />
                      </span>
                      <button
                        type="button"
                        className="flex min-w-0 flex-1 items-center gap-2 py-3 pr-3 text-left"
                        onClick={() => {
                          setEditIndex(index)
                          setFormData(item)
                        }}
                      >
                        <p className="truncate text-sm font-medium text-zinc-900">
                          {primaryField ? (item[primaryField.name] as string) : '(untitled)'}
                        </p>
                        {secondaryField && (item[secondaryField.name] as string) && (
                          <>
                            <span className="shrink-0 text-zinc-300">·</span>
                            <p className="min-w-0 truncate text-sm text-zinc-500">
                              {item[secondaryField.name] as string}
                            </p>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </SortableCardItem>
          ))}
        </SortableContext>
      </DndContext>

      <div className="mt-2 overflow-hidden rounded-lg border border-dashed border-zinc-200 bg-white transition-colors hover:border-zinc-300">
        {editIndex === list.length ? (
          renderForm('add')
        ) : (
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-zinc-50"
            onClick={() => {
              setEditIndex(list.length)
              setFormData(defaultItem)
            }}
          >
            <Plus size={13} className="shrink-0 text-zinc-400" />
            <span className="text-sm text-zinc-400">Add {itemLabel}</span>
          </button>
        )}
      </div>
    </>
  )
}

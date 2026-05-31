import { useState, useCallback, useEffect } from 'react'
import { Reorder } from 'framer-motion'
import { Pencil, Plus } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { cn } from '../../lib/utils'
import { Button } from './button'
import { Switch } from './switch'
import { DraggableCardItem } from './DraggableCardItem'
import SkillsInput from './SkillsInput'

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
  'flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-primary'
const textareaClass =
  'flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-primary'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
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
  const [reorderToggle, setReorderToggle] = useState(false)
  const [formData, setFormData] = useState<SectionItem>(defaultItem)

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

    if (field.type === 'textarea' || field.type === 'richtext') {
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
      <div className="p-3">
        <p className="mb-2 font-semibold text-zinc-900">
          {mode === 'edit' ? `Edit ${itemLabel}` : `Add ${itemLabel}`}
        </p>
        <div className="flex flex-col gap-2">
          {rows.map((row, rowIdx) =>
            row.length === 1 ? (
              <div key={rowIdx}>{renderFieldInput(row[0])}</div>
            ) : (
              <div key={rowIdx} className="flex flex-col gap-2 sm:flex-row">
                {row.map((field) => (
                  <div key={field.name} className="w-full sm:w-1/2">
                    {renderFieldInput(field)}
                  </div>
                ))}
              </div>
            ),
          )}
        </div>
        <div className="mt-3 flex justify-end gap-2">
          {mode === 'edit' && (
            <Button
              variant="destructive"
              size="sm"
              className="mr-auto"
              onClick={del}
            >
              Delete
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={cancel}>
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
      <div className="flex justify-end py-1">
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-600">Reorder</label>
          <Switch checked={reorderToggle} onCheckedChange={setReorderToggle} />
        </div>
      </div>

      <Reorder.Group
        values={list}
        onReorder={(newOrder) => {
          setList(newOrder)
          onUpdate(newOrder)
        }}
      >
        {list.map((item, index) => (
          <DraggableCardItem key={item.id} item={item} reorderToggle={reorderToggle}>
            <div
              className={cn(
                'mt-2 rounded-lg bg-zinc-100 shadow-sm',
                reorderToggle && 'rounded-tl-none',
              )}
            >
              {editIndex === index ? (
                renderForm('edit')
              ) : (
                <div className="flex items-center gap-2 p-3">
                  <p className="font-semibold text-zinc-900 truncate">
                    {primaryField ? (item[primaryField.name] as string) : ''}
                  </p>
                  {secondaryField && (
                    <>
                      <span className="shrink-0 text-zinc-400">·</span>
                      <p className="min-w-0 truncate text-sm text-zinc-600">
                        {item[secondaryField.name] as string}
                      </p>
                    </>
                  )}
                  <Button
                    size="icon"
                    className="ml-auto size-8 shrink-0"
                    onClick={() => {
                      setReorderToggle(false)
                      setEditIndex(index)
                      setFormData(item)
                    }}
                  >
                    <Pencil size={14} />
                  </Button>
                </div>
              )}
            </div>
          </DraggableCardItem>
        ))}
      </Reorder.Group>

      <div className="mt-2 rounded-lg bg-zinc-100 shadow-sm">
        {editIndex === list.length ? (
          renderForm('add')
        ) : (
          <div className="flex items-center justify-between p-3">
            <p className="text-sm text-zinc-600">Add {itemLabel}</p>
            <Button
              size="icon"
              className="size-8"
              onClick={() => {
                setEditIndex(list.length)
                setFormData(defaultItem)
              }}
            >
              <Plus size={14} />
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

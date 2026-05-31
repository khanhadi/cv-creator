// @ts-nocheck
import { useState, useCallback, useEffect } from 'react'
import { DraggableCardItem } from '../DraggableCardItem'
import { Reorder } from 'framer-motion'
import { Pencil, Plus } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { cn } from '../../../lib/utils'
import { Button } from '../button'
import { Switch } from '../switch'

const inputClass = 'flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-primary'
const textareaClass = 'flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-primary'

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      {children}
    </div>
  )
}

export default function CustomSectionCard({ sectionTitle, sectionItemsList, onSectionUpdate }) {
  const defaultFormData = { heading: '', subHeading: '', description: '', date: '', additionalInfo: '' }
  const [editIndex, setEditIndex] = useState(null)
  const [reorderToggle, setReorderToggle] = useState(false)
  const [formData, setFormData] = useState(defaultFormData)

  const ensureId = (item) => item.id ? item : { ...item, id: uuidv4() }
  const [list, setList] = useState(sectionItemsList.map(ensureId))
  useEffect(() => { setList(sectionItemsList.map(ensureId)) }, [sectionItemsList])

  const handleInput = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const save = () => {
    const updated = editIndex !== null && editIndex < list.length
      ? list.map((item, i) => i === editIndex ? { ...formData, id: item.id } : item)
      : [...list, { ...formData, id: uuidv4() }]
    setList(updated); onSectionUpdate({ title: sectionTitle, items: updated })
    setTimeout(() => { setEditIndex(null); setFormData(defaultFormData) }, 10)
  }

  const cancel = () => { setEditIndex(null); setFormData(defaultFormData) }

  const del = () => {
    const updated = list.filter((_, i) => i !== editIndex)
    setList(updated); onSectionUpdate({ title: sectionTitle, items: updated })
    setTimeout(() => { setEditIndex(null); setFormData(defaultFormData) }, 10)
  }

  return (
    <>
      <div className="flex justify-end py-1">
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-600">Reorder</label>
          <Switch checked={reorderToggle} onCheckedChange={setReorderToggle} />
        </div>
      </div>

      <Reorder.Group values={list} onReorder={(newOrder) => { setList(newOrder); onSectionUpdate({ title: sectionTitle, items: newOrder }) }}>
        {list.map((item, index) => (
          <DraggableCardItem key={item.id} item={item} reorderToggle={reorderToggle}>
            <div className={cn('mt-2 rounded-lg bg-zinc-100 shadow-sm', reorderToggle && 'rounded-tl-none')}>
              {editIndex === index ? (
                <div className="p-3">
                  <p className="mb-2 font-semibold text-zinc-900">Edit Item</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Field label="Heading"><input name="heading" value={formData.heading} onChange={handleInput} placeholder="Heading" className={inputClass} /></Field>
                    <Field label="Sub Heading"><input name="subHeading" value={formData.subHeading} onChange={handleInput} placeholder="Sub heading" className={inputClass} /></Field>
                  </div>
                  <Field label="Description"><textarea name="description" value={formData.description} onChange={handleInput} placeholder="..." className={textareaClass} /></Field>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Field label="Date"><input name="date" value={formData.date} onChange={handleInput} placeholder="Date" className={inputClass} /></Field>
                    <Field label="Additional Info"><input name="additionalInfo" value={formData.additionalInfo} onChange={handleInput} placeholder="Extra info" className={inputClass} /></Field>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <Button variant="destructive" size="sm" className="mr-auto" onClick={del}>Delete</Button>
                    <Button variant="outline" size="sm" onClick={cancel}>Cancel</Button>
                    <Button size="sm" onClick={save}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3">
                  <p className="font-semibold text-zinc-900">{item.heading}</p>
                  <span className="text-zinc-400">·</span>
                  <p className="text-sm text-zinc-600">{item.subHeading}</p>
                  <Button size="icon" className="ml-auto size-8 shrink-0" onClick={() => { setReorderToggle(false); setEditIndex(index); setFormData(item) }}>
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
          <div className="p-3">
            <p className="mb-2 font-semibold text-zinc-900">Add Item</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Field label="Heading"><input name="heading" value={formData.heading} onChange={handleInput} placeholder="Heading" className={inputClass} /></Field>
              <Field label="Sub Heading"><input name="subHeading" value={formData.subHeading} onChange={handleInput} placeholder="Sub heading" className={inputClass} /></Field>
            </div>
            <Field label="Description"><textarea name="description" value={formData.description} onChange={handleInput} placeholder="..." className={textareaClass} /></Field>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Field label="Date"><input name="date" value={formData.date} onChange={handleInput} placeholder="Date" className={inputClass} /></Field>
              <Field label="Additional Info"><input name="additionalInfo" value={formData.additionalInfo} onChange={handleInput} placeholder="Extra info" className={inputClass} /></Field>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={cancel}>Cancel</Button>
              <Button size="sm" onClick={save}>Add</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3">
            <p className="text-sm text-zinc-600">Add Item</p>
            <Button size="icon" className="size-8" onClick={() => { setEditIndex(list.length); setFormData({ ...defaultFormData, id: uuidv4() }) }}>
              <Plus size={14} />
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

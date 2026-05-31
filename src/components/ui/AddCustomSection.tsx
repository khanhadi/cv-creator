// @ts-nocheck
import { useState } from 'react'
import { Button } from '../ui/button'

export default function AddCustomSection({ sectionsOrder, inclusionObject, handleSectionOrder, handleInclusion, handleSectionData }) {
  const [sectionTitle, setSectionTitle] = useState('')
  const [error, setError] = useState('')

  const handleAddBtn = () => {
    if (!sectionTitle.trim()) {
      setError('Section title cannot be empty.')
      return
    }
    const exists = sectionsOrder.some((s) => s.toLowerCase() === sectionTitle.trim().toLowerCase())
    if (exists) {
      setError('This section already exists.')
      return
    }
    handleSectionOrder([...sectionsOrder, sectionTitle])
    handleSectionData({ title: sectionTitle, items: [] })
    handleInclusion({ ...inclusionObject, [sectionTitle]: true })
    setSectionTitle('')
    setError('')
  }

  return (
    <>
      <p className="mb-2 text-base font-medium text-zinc-900">Add Custom Section</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={sectionTitle}
          onChange={(e) => { setSectionTitle(e.target.value); setError('') }}
          placeholder="Section title"
          className="flex h-8 flex-1 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:ring-1 focus:ring-primary"
        />
        <Button size="sm" onClick={handleAddBtn}>Add</Button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </>
  )
}

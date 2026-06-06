import { useState } from 'react'
import { Button } from '../ui/button'
import { useResumeStore } from '../../store/resumeStore'

export default function AddCustomSection() {
  const sectionsOrder = useResumeStore((s) => s.sectionsOrder)
  const addCustomSection = useResumeStore((s) => s.addCustomSection)
  const [sectionTitle, setSectionTitle] = useState('')
  const [error, setError] = useState('')

  const handleAdd = () => {
    const title = sectionTitle.trim()
    if (!title) {
      setError('Section title cannot be empty.')
      return
    }
    if (sectionsOrder.some((s) => s.toLowerCase() === title.toLowerCase())) {
      setError('This section already exists.')
      return
    }
    addCustomSection(title)
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
          onChange={(e) => {
            setSectionTitle(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Section title"
          className="flex h-8 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-black/[0.06]"
        />
        <Button size="sm" onClick={handleAdd}>
          Add
        </Button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </>
  )
}

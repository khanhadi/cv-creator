import { useState } from 'react'
import { Badge } from './badge'

interface SkillsInputProps {
  value: string[]
  onChange: (skills: string[]) => void
}

export default function SkillsInput({ value, onChange }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      onChange([...value, inputValue.trim()])
      setInputValue('')
    }
  }

  return (
    <div className="flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-zinc-200 bg-white p-2">
      {value.map((skill, index) => (
        <Badge key={index} variant="secondary" className="gap-1">
          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            className="text-zinc-500 hover:text-zinc-900"
          >
            &times;
          </button>
          {skill}
        </Badge>
      ))}
      <input
        type="text"
        placeholder="Add skill, press Enter"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 text-sm outline-none"
      />
    </div>
  )
}

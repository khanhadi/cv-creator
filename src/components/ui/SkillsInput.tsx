// @ts-nocheck
import { useState, useRef, useEffect } from 'react'
import { Badge } from './badge'

export default function SkillsInput({ initialSkills, inputHandler }) {
  const [skills, setSkills] = useState(initialSkills)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputHandler({ target: { name: 'skills', value: skills } })
  }, [skills, inputHandler])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      setSkills([...skills, inputValue.trim()])
      setInputValue('')
    }
  }

  return (
    <div className="flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-zinc-200 bg-white p-2">
      {skills.map((skill, index) => (
        <Badge key={index} variant="secondary" className="gap-1">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setSkills(skills.filter((_, i) => i !== index)) }}
            className="text-zinc-500 hover:text-zinc-900"
          >
            &times;
          </button>
          {skill}
        </Badge>
      ))}
      <input
        ref={inputRef}
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

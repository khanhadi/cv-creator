import { Plus, X } from '@phosphor-icons/react'
import linkedinIcon from '../../assets/icons/cv-icons/linkedin.png'
import githubIcon from '../../assets/icons/cv-icons/github.png'
import xIcon from '../../assets/icons/cv-icons/x.png'
import linkIcon from '../../assets/icons/cv-icons/link.png'
import { useResumeStore } from '../../store/resumeStore'
import type { SocialLink } from '../../defaultResumeData'

const PLATFORMS: { id: string; label: string; icon: string; placeholder: string }[] = [
  { id: 'linkedin', label: 'LinkedIn', icon: linkedinIcon, placeholder: 'linkedin.com/in/yourname' },
  { id: 'github',   label: 'GitHub',   icon: githubIcon,   placeholder: 'github.com/yourname' },
  { id: 'x',        label: 'X',        icon: xIcon,        placeholder: 'x.com/yourname' },
  { id: 'website',  label: 'Website',  icon: linkIcon,     placeholder: 'yoursite.com' },
]

export default function SocialInput() {
  const socialLinks = useResumeStore((s) => s.resumeData.socialLinks ?? [])
  const setField = useResumeStore((s) => s.setField)

  const update = (links: SocialLink[]) => setField('socialLinks', links)

  const addPlatform = (id: string) => {
    update([...socialLinks, { platform: id, url: '' }])
  }

  const removePlatform = (index: number) => {
    update(socialLinks.filter((_, i) => i !== index))
  }

  const updateUrl = (index: number, url: string) => {
    update(socialLinks.map((l, i) => i === index ? { ...l, url } : l))
  }

  const addedIds = new Set(socialLinks.map((l) => l.platform))
  const available = PLATFORMS.filter((p) => !addedIds.has(p.id))

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-zinc-400">Social links</label>

      {socialLinks.map((link, i) => {
        const meta = PLATFORMS.find((p) => p.id === link.platform)
        return (
          <div key={link.platform} className="flex items-center gap-1.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white">
              {meta && <img src={meta.icon} alt={meta.label} className="h-[14px] w-[14px]" />}
            </div>
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateUrl(i, e.target.value)}
              placeholder={meta?.placeholder ?? 'URL'}
              className="flex h-9 flex-1 min-w-0 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-black/[0.06]"
            />
            <button
              type="button"
              aria-label={`Remove ${meta?.label ?? link.platform} link`}
              onClick={() => removePlatform(i)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}

      {available.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {available.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => addPlatform(p.id)}
              className="flex h-7 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs text-zinc-500 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-700"
            >
              <Plus size={10} />
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

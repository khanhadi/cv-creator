// @ts-nocheck
import { cn } from '../../lib/utils'
import githubIcon from '../../assets/icons/cv-icons/github.png'

export default function SocialInput({ socialLink, resumeDataHandler, socialHandler, selectedSocial }) {
  const btnClass = (id) =>
    cn(
      'flex h-9 items-center justify-center border border-zinc-200 bg-white px-2 text-zinc-700 transition hover:bg-zinc-50 first:rounded-l-md last:rounded-r-md',
      selectedSocial === id && 'border-primary bg-primary/10 text-primary',
    )

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-zinc-700">Social</label>
      <div className="flex">
        <button type="button" className={btnClass('linkedin')} onClick={() => socialHandler('linkedin')}>
          <i className="icon icon-linkedin" />
        </button>
        <button type="button" className={btnClass('github')} onClick={() => socialHandler('github')}>
          <img width={16} src={githubIcon} alt="GitHub" />
        </button>
        <button type="button" className={btnClass('x')} onClick={() => socialHandler('x')}>
          <i className="icon icon-x" />
        </button>
        <input
          type="text"
          name="socialLink"
          onChange={resumeDataHandler}
          value={socialLink}
          placeholder="Profile link"
          className="flex h-9 flex-1 rounded-r-md border border-l-0 border-zinc-200 bg-white px-3 text-sm outline-none transition focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  )
}

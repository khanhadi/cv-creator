import { Check } from 'lucide-react'
import { cn } from '../lib/utils'
import { useResumeStore } from '../store/resumeStore'
import { TEMPLATE_REGISTRY } from '../templates'
import type { ColorScheme } from '../templates/types'

interface TemplateCardProps {
  name: string
  description: string
  isSelected: boolean
  isAvailable: boolean
  primaryColor: string
  onSelect: () => void
}

function TemplateCard({
  name,
  description: _description,
  isSelected,
  isAvailable,
  primaryColor,
  onSelect,
}: TemplateCardProps) {
  return (
    <button
      disabled={!isAvailable}
      onClick={onSelect}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-lg border-2 transition-all',
        isSelected
          ? 'border-primary shadow-sm'
          : 'border-zinc-200 hover:border-zinc-300',
        !isAvailable && 'cursor-not-allowed opacity-50',
      )}
    >
      {/* Abstract CV preview */}
      <div className="aspect-[3/4] w-full bg-zinc-50 p-2">
        <div className="h-full rounded border border-zinc-100 bg-white p-2">
          <div
            className="mb-1 h-2 rounded-full"
            style={{ backgroundColor: primaryColor, width: '65%' }}
          />
          <div className="mb-2 h-1 w-4/5 rounded-full bg-zinc-200" />
          <div className="mb-1 h-1.5 w-1/2 rounded-full bg-zinc-300" />
          <div className="mb-1.5 h-px w-full bg-zinc-200" />
          <div className="mb-0.5 h-1 w-4/5 rounded-full bg-zinc-100" />
          <div className="mb-0.5 h-1 w-3/4 rounded-full bg-zinc-100" />
          <div className="mb-0.5 h-1 w-4/5 rounded-full bg-zinc-100" />
          <div className="mb-1 mt-2 h-1.5 w-1/2 rounded-full bg-zinc-300" />
          <div className="mb-1.5 h-px w-full bg-zinc-200" />
          <div className="mb-0.5 h-1 w-4/5 rounded-full bg-zinc-100" />
          <div className="mb-0.5 h-1 w-2/3 rounded-full bg-zinc-100" />
          <div className="mb-1 mt-2 h-1.5 w-1/2 rounded-full bg-zinc-300" />
          <div className="mb-1.5 h-px w-full bg-zinc-200" />
          <div className="mb-0.5 h-1 w-3/4 rounded-full bg-zinc-100" />
          <div className="h-1 w-4/5 rounded-full bg-zinc-100" />
        </div>
      </div>

      <div className="border-t border-zinc-100 px-2 py-1.5">
        <p className="text-center text-xs font-medium text-zinc-700">{name}</p>
        {!isAvailable && (
          <p className="text-center text-[10px] text-zinc-400">Coming soon</p>
        )}
      </div>

      {isSelected && (
        <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
          <Check size={10} className="text-primary-foreground" />
        </div>
      )}
    </button>
  )
}

const UPCOMING_TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Bold header, contemporary feel' },
  { id: 'minimal', name: 'Minimal', description: 'Ultra-clean, whitespace-focused' },
]

const FONT_SIZE_LABELS = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
} as const

type FontSizePreset = keyof typeof FONT_SIZE_LABELS

function detectFontSizePreset(sizeBody: number): FontSizePreset {
  if (sizeBody <= 10) return 'small'
  if (sizeBody >= 12) return 'large'
  return 'medium'
}

export default function DesignTab() {
  const resumeData = useResumeStore((s) => s.resumeData)
  const setTemplate = useResumeStore((s) => s.setTemplate)
  const setColorScheme = useResumeStore((s) => s.setColorScheme)
  const setPrimaryColor = useResumeStore((s) => s.setPrimaryColor)
  const setFontSizePreset = useResumeStore((s) => s.setFontSizePreset)

  const { templateId, templateOptions } = resumeData
  const currentTemplate = TEMPLATE_REGISTRY[templateId]
  const palettes = currentTemplate?.meta.presetPalettes ?? []
  const currentPreset = detectFontSizePreset(templateOptions.font.sizeBody)

  return (
    <div className="space-y-6">
      {/* Template */}
      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Template
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          {Object.values(TEMPLATE_REGISTRY).map(({ meta }) => (
            <TemplateCard
              key={meta.id}
              name={meta.name}
              description={meta.description}
              isSelected={templateId === meta.id}
              isAvailable
              primaryColor={templateOptions.colorScheme.primary}
              onSelect={() => setTemplate(meta.id)}
            />
          ))}
          {UPCOMING_TEMPLATES.map((t) => (
            <TemplateCard
              key={t.id}
              name={t.name}
              description={t.description}
              isSelected={false}
              isAvailable={false}
              primaryColor="#94a3b8"
              onSelect={() => {}}
            />
          ))}
        </div>
      </section>

      {/* Color */}
      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Color
        </h3>
        <div className="mb-3 flex flex-wrap gap-2">
          {palettes.map((palette, i) => {
            const isActive =
              JSON.stringify(palette) ===
              JSON.stringify(templateOptions.colorScheme)
            return (
              <button
                key={i}
                title={`Palette ${i + 1}`}
                onClick={() => setColorScheme(palette as ColorScheme)}
                className={cn(
                  'h-7 w-7 rounded-full border-2 transition-transform',
                  isActive
                    ? 'scale-110 border-zinc-700 shadow'
                    : 'border-transparent hover:scale-105 hover:border-zinc-300',
                )}
                style={{ backgroundColor: palette.primary }}
              />
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-zinc-600">Custom accent</label>
          <input
            type="color"
            value={templateOptions.colorScheme.primary}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="h-7 w-10 cursor-pointer rounded border border-zinc-200 bg-white p-0.5"
          />
          <span className="font-mono text-xs text-zinc-400">
            {templateOptions.colorScheme.primary}
          </span>
        </div>
      </section>

      {/* Font Size */}
      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Font Size
        </h3>
        <div className="flex gap-2">
          {(Object.keys(FONT_SIZE_LABELS) as FontSizePreset[]).map((preset) => (
            <button
              key={preset}
              onClick={() => setFontSizePreset(preset)}
              className={cn(
                'flex-1 rounded-md border py-1.5 text-sm font-medium transition',
                currentPreset === preset
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300',
              )}
            >
              {FONT_SIZE_LABELS[preset]}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

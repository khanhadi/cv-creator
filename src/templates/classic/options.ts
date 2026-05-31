import type { ColorScheme, TemplateMeta, TemplateOptions } from '../types'

export const CLASSIC_PALETTES: ColorScheme[] = [
  {
    primary: '#4c0519',
    text: '#000000',
    heading: '#000000',
    subtext: '#4c0519',
    divider: '#000000',
    background: '#ffffff',
  },
  {
    primary: '#1e3a5f',
    text: '#111827',
    heading: '#111827',
    subtext: '#1e3a5f',
    divider: '#374151',
    background: '#ffffff',
  },
  {
    primary: '#14532d',
    text: '#111827',
    heading: '#111827',
    subtext: '#14532d',
    divider: '#374151',
    background: '#ffffff',
  },
  {
    primary: '#334155',
    text: '#0f172a',
    heading: '#0f172a',
    subtext: '#334155',
    divider: '#64748b',
    background: '#ffffff',
  },
]

export const classicDefaultOptions: TemplateOptions = {
  colorScheme: CLASSIC_PALETTES[0],
  font: {
    family: 'Open Sauce One',
    sizeName: 30,
    sizeSection: 13,
    sizeBody: 11,
  },
  showIcons: true,
  pagePadding: { top: 30, bottom: 30, horizontal: 30 },
}

export const classicMeta: TemplateMeta = {
  id: 'classic',
  name: 'Classic',
  description: 'Clean single-column layout',
  presetPalettes: CLASSIC_PALETTES,
  defaultOptions: classicDefaultOptions,
}

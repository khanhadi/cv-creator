import type { ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import type { ResumeData } from '../defaultResumeData'

export interface ColorScheme {
  primary: string
  text: string
  heading: string
  subtext: string
  divider: string
  background: string
}

export interface TemplateOptions {
  colorScheme: ColorScheme
  font: {
    family: string
    sizeName: number
    sizeSection: number
    sizeBody: number
  }
  showIcons?: boolean
  pagePadding?: { top: number; bottom: number; horizontal: number }
}

export interface TemplateRenderProps {
  data: ResumeData
  options: TemplateOptions
  sectionsOrder: string[]
}

export type TemplateRenderer = (props: TemplateRenderProps) => ReactElement<DocumentProps>

export interface TemplateMeta {
  id: string
  name: string
  description: string
  presetPalettes: ColorScheme[]
  defaultOptions: TemplateOptions
}

export interface TemplateDefinition {
  meta: TemplateMeta
  renderer: TemplateRenderer
}

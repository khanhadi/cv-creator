import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultResumeData, DEFAULT_SECTIONS_ORDER } from '../defaultResumeData'
import type { ResumeData } from '../defaultResumeData'
import type { ColorScheme } from '../templates/types'
import { getTemplate } from '../templates'
import { classicDefaultOptions } from '../templates/classic/options'

type ViewMode = 'edit' | 'preview'

interface ResumeStore {
  resumeData: ResumeData
  sectionsOrder: string[]
  viewMode: ViewMode

  setField: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void
  setResumeData: (data: ResumeData) => void
  resetToDefault: () => void
  clearAll: () => void

  setSectionsOrder: (order: string[]) => void
  addCustomSection: (title: string) => void
  deleteCustomSection: (sectionName: string) => void

  setTemplate: (id: string) => void
  setColorScheme: (scheme: ColorScheme) => void
  setPrimaryColor: (hex: string) => void
  setFontSizePreset: (preset: 'small' | 'medium' | 'large') => void

  setViewMode: (mode: ViewMode) => void
}

export function normalizeResumeData(data: Partial<ResumeData>): ResumeData {
  return {
    ...defaultResumeData,
    ...data,
    templateId: data.templateId ?? 'classic',
    templateOptions: data.templateOptions ?? classicDefaultOptions,
    socialPlatform: data.socialPlatform ?? 'linkedin',
  }
}

function getInitialResumeData(): ResumeData {
  if (typeof window === 'undefined') return defaultResumeData
  try {
    const stored = localStorage.getItem('resumeData')
    if (stored) return normalizeResumeData(JSON.parse(stored) as Partial<ResumeData>)
  } catch {}
  return defaultResumeData
}

function getInitialSectionsOrder(): string[] {
  if (typeof window === 'undefined') return DEFAULT_SECTIONS_ORDER
  try {
    const stored = localStorage.getItem('sectionsOrder')
    if (stored) return JSON.parse(stored) as string[]
  } catch {}
  return DEFAULT_SECTIONS_ORDER
}

const FONT_SIZE_PRESETS = {
  small: { sizeName: 26, sizeSection: 12, sizeBody: 10 },
  medium: { sizeName: 30, sizeSection: 13, sizeBody: 11 },
  large: { sizeName: 34, sizeSection: 14, sizeBody: 12 },
} as const

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: getInitialResumeData(),
      sectionsOrder: getInitialSectionsOrder(),
      viewMode: 'edit' as ViewMode,

      setField: (key, value) =>
        set((state) => ({ resumeData: { ...state.resumeData, [key]: value } })),

      setResumeData: (data) =>
        set({
          resumeData: normalizeResumeData(data),
          sectionsOrder: Object.keys(data.includeSections),
        }),

      resetToDefault: () =>
        set({
          resumeData: defaultResumeData,
          sectionsOrder: DEFAULT_SECTIONS_ORDER,
        }),

      clearAll: () =>
        set({
          resumeData: {
            ...defaultResumeData,
            fullName: '',
            mobileNo: '',
            email: '',
            socialLink: '',
            includeSections: {},
            educationList: [],
            experienceList: [],
            projectsList: [],
            customSectionData: [],
          },
          sectionsOrder: [],
        }),

      setSectionsOrder: (order) => set({ sectionsOrder: order }),

      addCustomSection: (title) =>
        set((state) => ({
          sectionsOrder: [...state.sectionsOrder, title],
          resumeData: {
            ...state.resumeData,
            includeSections: {
              ...state.resumeData.includeSections,
              [title]: true,
            },
            customSectionData: [
              ...state.resumeData.customSectionData,
              { title, items: [] },
            ],
          },
        })),

      deleteCustomSection: (sectionName) =>
        set((state) => {
          const includeSections = { ...state.resumeData.includeSections }
          delete includeSections[sectionName]
          return {
            sectionsOrder: state.sectionsOrder.filter((s) => s !== sectionName),
            resumeData: {
              ...state.resumeData,
              includeSections,
              customSectionData: state.resumeData.customSectionData.filter(
                (s) => s.title !== sectionName,
              ),
            },
          }
        }),

      setTemplate: (id) => {
        const template = getTemplate(id)
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            templateId: id,
            templateOptions: template.meta.defaultOptions,
          },
        }))
      },

      setColorScheme: (scheme) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            templateOptions: {
              ...state.resumeData.templateOptions,
              colorScheme: scheme,
            },
          },
        })),

      setPrimaryColor: (hex) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            templateOptions: {
              ...state.resumeData.templateOptions,
              colorScheme: {
                ...state.resumeData.templateOptions.colorScheme,
                primary: hex,
                subtext: hex,
              },
            },
          },
        })),

      setFontSizePreset: (preset) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            templateOptions: {
              ...state.resumeData.templateOptions,
              font: {
                ...state.resumeData.templateOptions.font,
                ...FONT_SIZE_PRESETS[preset],
              },
            },
          },
        })),

      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    { name: 'resume-store' },
  ),
)

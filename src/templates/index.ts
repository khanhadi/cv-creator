import type { TemplateDefinition } from './types'
import classicTemplate from './classic'

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  classic: classicTemplate,
}

export function getTemplate(id: string): TemplateDefinition {
  return TEMPLATE_REGISTRY[id] ?? TEMPLATE_REGISTRY.classic
}

export type TemplateId = keyof typeof TEMPLATE_REGISTRY

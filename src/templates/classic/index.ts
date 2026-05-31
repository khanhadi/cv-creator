import type { TemplateDefinition } from '../types'
import { classicMeta } from './options'
import ClassicRenderer from './renderer'

const classicTemplate: TemplateDefinition = {
  meta: classicMeta,
  renderer: ClassicRenderer,
}

export default classicTemplate

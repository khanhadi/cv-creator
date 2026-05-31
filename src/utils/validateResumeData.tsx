import type { ResumeData, Education, Experience, Project, CustomSection, CustomSectionItem } from '../defaultResumeData'

function isValidDescription(value: unknown): boolean {
  if (typeof value === 'string') return true
  if (typeof value === 'object' && value !== null && 'type' in value) return true
  return false
}

function validateEducationItem(edu: Education): boolean {
  const stringFields = ['institutionName', 'courseTitle', 'date', 'grade'] as const
  for (const field of stringFields) {
    if (typeof edu[field] !== 'string') {
      console.error(`Validation failed: Education item ${field} is missing or not a string`)
      return false
    }
  }
  if (!isValidDescription(edu.description)) {
    console.error('Validation failed: Education item description is invalid')
    return false
  }
  return true
}

function validateExperienceItem(exp: Experience): boolean {
  const stringFields = ['companyName', 'jobTitle', 'date', 'location'] as const
  for (const field of stringFields) {
    if (typeof exp[field] !== 'string') {
      console.error(`Validation failed: Experience item ${field} is missing or not a string`)
      return false
    }
  }
  if (!Array.isArray(exp.skills)) {
    console.error('Validation failed: Experience item skills is not an array')
    return false
  }
  if (!isValidDescription(exp.description)) {
    console.error('Validation failed: Experience item description is invalid')
    return false
  }
  return true
}

function validateProjectItem(proj: Project): boolean {
  const stringFields = ['projectName', 'subHeading', 'date'] as const
  for (const field of stringFields) {
    if (typeof proj[field] !== 'string') {
      console.error(`Validation failed: Project item ${field} is missing or not a string`)
      return false
    }
  }
  if (!isValidDescription(proj.description)) {
    console.error('Validation failed: Project item description is invalid')
    return false
  }
  return true
}

function validateCustomSectionItem(item: CustomSectionItem): boolean {
  const stringFields = ['heading', 'subHeading', 'date', 'additionalInfo'] as const
  for (const field of stringFields) {
    if (typeof item[field] !== 'string') {
      console.error(`Validation failed: Custom section item ${field} is missing or not a string`)
      return false
    }
  }
  if (!isValidDescription(item.description)) {
    console.error('Validation failed: Custom section item description is invalid')
    return false
  }
  return true
}

function validateCustomSection(section: CustomSection): boolean {
  if (typeof section.title !== 'string') {
    console.error('Validation failed: Custom section title is not a string')
    return false
  }
  if (!Array.isArray(section.items) || section.items.length === 0) {
    console.error('Validation failed: Custom section items is not an array or is empty')
    return false
  }
  for (const item of section.items) {
    if (!validateCustomSectionItem(item)) return false
  }
  return true
}

export default function validateResumeData(data: unknown): data is ResumeData {
  if (typeof data !== 'object' || data === null) {
    console.error('Validation failed: data is not an object')
    return false
  }

  const d = data as Record<string, unknown>

  const requiredStringFields = ['fullName', 'mobileNo', 'email', 'socialLink']
  for (const field of requiredStringFields) {
    if (typeof d[field] !== 'string' || (d[field] as string).trim() === '') {
      console.error(`Validation failed: ${field} is missing or empty`)
      return false
    }
  }

  if (
    typeof d.includeSections !== 'object' ||
    d.includeSections === null ||
    !('education' in (d.includeSections as object)) ||
    !('professionalExperience' in (d.includeSections as object)) ||
    !('projects' in (d.includeSections as object))
  ) {
    console.error('Validation failed: includeSections object is invalid')
    return false
  }

  if (!Array.isArray(d.educationList) || d.educationList.length === 0) {
    console.error('Validation failed: educationList is not an array or is empty')
    return false
  }
  for (const edu of d.educationList as Education[]) {
    if (!validateEducationItem(edu)) return false
  }

  if (!Array.isArray(d.experienceList) || d.experienceList.length === 0) {
    console.error('Validation failed: experienceList is not an array or is empty')
    return false
  }
  for (const exp of d.experienceList as Experience[]) {
    if (!validateExperienceItem(exp)) return false
  }

  if (!Array.isArray(d.projectsList) || d.projectsList.length === 0) {
    console.error('Validation failed: projectsList is not an array or is empty')
    return false
  }
  for (const proj of d.projectsList as Project[]) {
    if (!validateProjectItem(proj)) return false
  }

  if (!Array.isArray(d.customSectionData)) {
    console.error('Validation failed: customSectionData is not an array')
    return false
  }
  for (const section of d.customSectionData as CustomSection[]) {
    if (!validateCustomSection(section)) return false
  }

  return true
}

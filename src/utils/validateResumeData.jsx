export default function validateResumeData(data) {
  // Check top-level required fields
  const requiredFields = ['fullName', 'mobileNo', 'email', 'socialLink'];
  for (const field of requiredFields) {
    if (typeof data[field] !== 'string' || data[field].trim() === '') {
      return false;
    }
  }

  // Check includeSections object
  if (
    typeof data.includeSections !== 'object' ||
    data.includeSections === null ||
    !('education' in data.includeSections) ||
    !('professionalExperience' in data.includeSections) ||
    !('projects' in data.includeSections) ||
    typeof data.includeSections.education !== 'boolean' ||
    typeof data.includeSections.professionalExperience !== 'boolean' ||
    typeof data.includeSections.projects !== 'boolean'
  ) {
    return false;
  }

  // Check educationList
  if (!Array.isArray(data.educationList) || data.educationList.length === 0) {
    return false;
  }
  for (const edu of data.educationList) {
    if (!validateEducationItem(edu)) return false;
  }

  // Check experienceList
  if (!Array.isArray(data.experienceList) || data.experienceList.length === 0) {
    return false;
  }
  for (const exp of data.experienceList) {
    if (!validateExperienceItem(exp)) return false;
  }

  // Check projectsList
  if (!Array.isArray(data.projectsList) || data.projectsList.length === 0) {
    return false;
  }
  for (const proj of data.projectsList) {
    if (!validateProjectItem(proj)) return false;
  }

  // Check customSectionData
  if (!Array.isArray(data.customSectionData)) {
    return false;
  }
  for (const section of data.customSectionData) {
    if (!validateCustomSection(section)) return false;
  }

  return true;
}

function validateEducationItem(edu) {
  return (
    typeof edu.include === 'boolean' &&
    typeof edu.institutionName === 'string' &&
    typeof edu.courseTitle === 'string' &&
    typeof edu.date === 'string' &&
    typeof edu.grade === 'string' &&
    typeof edu.description === 'string'
  );
}

function validateExperienceItem(exp) {
  return (
    typeof exp.include === 'boolean' &&
    typeof exp.companyName === 'string' &&
    typeof exp.jobTitle === 'string' &&
    typeof exp.date === 'string' &&
    typeof exp.location === 'string' &&
    Array.isArray(exp.skills) &&
    typeof exp.description === 'string'
  );
}

function validateProjectItem(proj) {
  return (
    typeof proj.include === 'boolean' &&
    typeof proj.projectName === 'string' &&
    typeof proj.subHeading === 'string' &&
    typeof proj.description === 'string' &&
    typeof proj.date === 'string'
  );
}

function validateCustomSection(section) {
  if (
    typeof section.title !== 'string' ||
    !Array.isArray(section.items) ||
    section.items.length === 0
  ) {
    return false;
  }
  for (const item of section.items) {
    if (!validateCustomSectionItem(item)) return false;
  }
  return true;
}

function validateCustomSectionItem(item) {
  return (
    typeof item.heading === 'string' &&
    typeof item.subHeading === 'string' &&
    typeof item.description === 'string' &&
    typeof item.date === 'string' &&
    typeof item.additionalInfo === 'string'
  );
}

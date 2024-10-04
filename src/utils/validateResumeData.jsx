export default function validateResumeData(data) {
  // Check top-level required fields
  const requiredFields = ['fullName', 'mobileNo', 'email', 'socialLink'];
  for (const field of requiredFields) {
    if (typeof data[field] !== 'string' || data[field].trim() === '') {
      console.error(`Validation failed: ${field} is missing or empty`);
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
    console.error('Validation failed: includeSections object is invalid');
    return false;
  }

  // Check educationList
  if (!Array.isArray(data.educationList) || data.educationList.length === 0) {
    console.error(
      'Validation failed: educationList is not an array or is empty'
    );
    return false;
  }
  for (const edu of data.educationList) {
    if (!validateEducationItem(edu)) return false;
  }

  // Check experienceList
  if (!Array.isArray(data.experienceList) || data.experienceList.length === 0) {
    console.error(
      'Validation failed: experienceList is not an array or is empty'
    );
    return false;
  }
  for (const exp of data.experienceList) {
    if (!validateExperienceItem(exp)) return false;
  }

  // Check projectsList
  if (!Array.isArray(data.projectsList) || data.projectsList.length === 0) {
    console.error(
      'Validation failed: projectsList is not an array or is empty'
    );
    return false;
  }
  for (const proj of data.projectsList) {
    if (!validateProjectItem(proj)) return false;
  }

  // Check customSectionData
  if (!Array.isArray(data.customSectionData)) {
    console.error('Validation failed: customSectionData is not an array');
    return false;
  }
  for (const section of data.customSectionData) {
    if (!validateCustomSection(section)) return false;
  }

  return true;
}

function validateEducationItem(edu) {
  const requiredFields = [
    'institutionName',
    'courseTitle',
    'date',
    'grade',
    'description',
  ];
  for (const field of requiredFields) {
    if (typeof edu[field] !== 'string') {
      console.error(
        `Validation failed: Education item ${field} is missing or not a string`
      );
      return false;
    }
  }
  return true;
}

function validateExperienceItem(exp) {
  const requiredFields = [
    'companyName',
    'jobTitle',
    'date',
    'location',
    'skills',
    'description',
  ];
  for (const field of requiredFields) {
    if (field === 'skills') {
      if (!Array.isArray(exp[field])) {
        console.error(
          'Validation failed: Experience item skills is not an array'
        );
        return false;
      }
    } else if (typeof exp[field] !== 'string') {
      console.error(
        `Validation failed: Experience item ${field} is missing or not a string`
      );
      return false;
    }
  }
  return true;
}

function validateProjectItem(proj) {
  const requiredFields = ['projectName', 'subHeading', 'description', 'date'];
  for (const field of requiredFields) {
    if (typeof proj[field] !== 'string') {
      console.error(
        `Validation failed: Project item ${field} is missing or not a string`
      );
      return false;
    }
  }
  return true;
}

function validateCustomSection(section) {
  if (typeof section.title !== 'string') {
    console.error('Validation failed: Custom section title is not a string');
    return false;
  }
  if (!Array.isArray(section.items) || section.items.length === 0) {
    console.error(
      'Validation failed: Custom section items is not an array or is empty'
    );
    return false;
  }
  for (const item of section.items) {
    if (!validateCustomSectionItem(item)) return false;
  }
  return true;
}

function validateCustomSectionItem(item) {
  const requiredFields = [
    'heading',
    'subHeading',
    'description',
    'date',
    'additionalInfo',
  ];
  for (const field of requiredFields) {
    if (typeof item[field] !== 'string') {
      console.error(
        `Validation failed: Custom section item ${field} is missing or not a string`
      );
      return false;
    }
  }
  return true;
}

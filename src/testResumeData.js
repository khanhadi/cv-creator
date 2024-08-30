export const testResumeData = {
  fullName: 'John Doe',
  mobileNo: ***REMOVED***,
  email: 'john@doe.com',
  socialLink: 'linkedin.com/in/johndoe',
  includeSections: {
    education: true,
    professionalExperience: true,
    test: true,
  },
  educationList: [
    {
      include: true,
      institutionName: 'University of Leeds',
      courseTitle: 'B.Sc (Hons) in Computer Science',
      date: 'Expected graduation date: Jun. 2026',
      grade: 'Predicted: First Class (1:1)',
      description:
        'Relevant Courses: Procedural Programming (C), Fundamental Mathematics, Computer Architecture and Professional Computing',
    },
  ],
  experienceList: [
    {
      include: true,
      companyName: 'Apple',
      jobTitle: 'Software Engineer',
      date: 'Feb 2024 - Present',
      location: 'Leeds, UK',
      skills: ['Java', 'SwiftUI'],
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis quibusdam libero ducimus eveniet porro alias nam totam\nea id unde a iusto aperiam officia necessitatibus quos illum ullam corrupti. Omnis.',
    },
  ],
  customSectionData: [
    {
      title: 'test',
      items: [{ heading: 'testHeading', subHeading: 'testSubHeading' }],
    },
  ],
};

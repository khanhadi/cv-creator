export const testResumeData = {
  fullName: 'Emily Chen',
  mobileNo: '+44 7912 345678',
  email: 'emily.chen@email.com',
  socialLink: 'linkedin.com/in/emilychen',
  includeSections: {
    education: true,
    professionalExperience: true,
    projects: true,
    Skills: true,
  },
  educationList: [
    {
      institutionName: 'University of Manchester',
      courseTitle: 'M.Sc. in Advanced Computer Science',
      date: 'Sep. 2023 - Jun. 2024',
      grade: 'Distinction (Expected)',
      description:
        'Specialization in Artificial Intelligence and Machine Learning. Thesis: "Explainable AI in Healthcare Decision Support Systems"',
    },
    {
      institutionName: 'University of Leeds',
      courseTitle: 'B.Sc. (Hons) in Computer Science',
      date: 'Sep. 2019 - Jun. 2023',
      grade: 'First Class Honours',
      description:
        'Final Year Project: Developing a Privacy-Preserving Federated Learning System for Mobile Devices',
    },
  ],
  experienceList: [
    {
      companyName: 'Google',
      jobTitle: 'Software Engineering Intern',
      date: 'Jun. 2023 - Sep. 2023',
      location: 'London, UK',
      skills: ['Python', 'TensorFlow', 'Cloud Computing'],
      description:
        "• Developed and optimized machine learning models for Google Cloud Vision API, improving text detection accuracy by 12%.\n• Collaborated with a team of 5 engineers to implement new features for the Cloud Natural Language API.\n• Participated in code reviews and contributed to the team's documentation and best practices.",
    },
    {
      companyName: 'Arm Ltd.',
      jobTitle: 'Research Assistant',
      date: 'Jul. 2022 - May 2023',
      location: 'Cambridge, UK',
      skills: ['C++', 'RISC-V', 'Computer Architecture'],
      description:
        "• Assisted in the development of energy-efficient algorithms for Arm's next-generation IoT processors.\n• Conducted performance analysis and optimization of RISC-V based systems.\n• Co-authored a conference paper on low-power computing architectures for edge AI applications.",
    },
  ],
  projectsList: [
    {
      projectName: 'EcoRoute',
      subHeading: 'AI-Powered Sustainable Transportation App',
      description:
        'Developed a mobile app that uses machine learning to suggest eco-friendly travel routes. Implemented real-time air quality data integration and multi-modal transportation options.',
      date: 'Jan. 2023 - Apr. 2023',
      link: 'https://github.com/emilychen/ecoroute',
    },
    {
      projectName: 'SecureChat',
      subHeading: 'End-to-End Encrypted Messaging Platform',
      description:
        'Built a secure messaging application using React Native and Node.js. Implemented end-to-end encryption using the Signal protocol and added features like self-destructing messages and two-factor authentication.',
      date: 'Sep. 2022 - Dec. 2022',
      link: 'https://github.com/emilychen/securechat',
    },
  ],
  customSectionData: [
    {
      title: 'Skills',
      items: [
        {
          heading: 'Programming Languages',
          subHeading:
            'Proficient in Python, Java, C++, JavaScript; Familiar with Rust, Go',
          description:
            'Extensive experience in developing applications and algorithms using these languages.',
          date: '',
          additionalInfo: '',
        },
        {
          heading: 'Technologies & Frameworks',
          subHeading: 'React, Node.js, TensorFlow, PyTorch, Docker, Kubernetes',
          description:
            'Proficient in building web applications, machine learning models, and managing containerized environments.',
          date: '',
          additionalInfo: '',
        },
        {
          heading: 'Tools & Platforms',
          subHeading: 'Git, JIRA, AWS, Google Cloud Platform, Linux/Unix',
          description:
            'Experienced in version control, project management, and cloud computing platforms.',
          date: '',
          additionalInfo: '',
        },
      ],
    },
  ],
};

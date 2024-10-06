import emailIcon from '../assets/icons/cv-icons/email.png';
import phoneIcon from '../assets/icons/cv-icons/phone.png';
import linkedinIcon from '../assets/icons/cv-icons/linkedin.png';
import githubIcon from '../assets/icons/cv-icons/github.png';
import xIcon from '../assets/icons/cv-icons/x.png';
import FormatText from '../utils/FormatText';
import { Link } from 'lucide-react';

export default function PDFRenderer({
  resumeData,
  selectedSocial,
  sectionsOrder,
}) {
  const getCustomSectionData = (customSectionData, sectionTitle) => {
    const existingSection = customSectionData.find(
      (section) => section.title === sectionTitle
    );
    return existingSection;
  };

  const getSocialIcon = (selectedSocial) => {
    switch (selectedSocial) {
      case 'linkedin':
        return linkedinIcon;
      case 'github':
        return githubIcon;
      case 'twitter':
        return xIcon;
      default:
        return linkedinIcon; // Default to LinkedIn if no valid option is selected
    }
  };

  function renderSection(sectionName) {
    switch (sectionName) {
      case 'education':
        return (
          <div className="mt-3 self-start">
            <p className="text-2xl">Education</p>
            <hr className="w-full border-black"></hr>
            <div className="self-start">
              {resumeData.educationList.map((education, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <p className="text-[16px] font-semibold">
                      {education.institutionName}
                    </p>
                    <p className="text-[16px] text-rose-950">
                      {education.date}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[16px] leading-3 text-rose-950">
                      {education.courseTitle}
                    </p>
                    <p className="text-[16px] font-bold italic text-rose-950">
                      {education.grade}
                    </p>
                  </div>
                  <FormatText text={education.description}></FormatText>
                </div>
              ))}
            </div>
          </div>
        );
      case 'professionalExperience':
        return (
          <div className="mt-3 w-full self-start">
            <p className="text-2xl">Professional Experience</p>
            <hr className="w-full border-black"></hr>
            <div className="self-start">
              {resumeData.experienceList.map((experience, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <p className="text-[16px] font-semibold">
                      {experience.companyName}
                    </p>
                    <p className="text-[16px] text-rose-950">
                      {experience.date} •{' '}
                      <span className="font-semibold">
                        {experience.location}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[16px] leading-3 text-rose-950">
                      {experience.jobTitle}
                    </p>
                    <p className="text-[16px] italic text-rose-950">
                      {experience.skills.join(', ')}
                    </p>
                  </div>
                  <FormatText text={experience.description}></FormatText>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return (
          <div className="mt-3 self-start">
            <p className="text-2xl">Projects</p>
            <hr className="w-full border-black"></hr>
            <div className="self-start">
              {resumeData.projectsList.map((project, index) => (
                <div key={index} className="mb-2">
                  <div className="flex items-baseline justify-between">
                    <p className="flex items-center text-[16px] font-semibold">
                      {project.link ? (
                        <>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mr-1 hover:underline"
                          >
                            {project.projectName}
                          </a>
                          <Link size={12} className="text-rose-950" />
                        </>
                      ) : (
                        project.projectName
                      )}
                    </p>
                    <p className="text-[16px] text-rose-950">{project.date}</p>
                  </div>
                  {project.subHeading && (
                    <p className="mb-1 text-[16px] italic leading-tight text-rose-950">
                      {project.subHeading}
                    </p>
                  )}
                  <FormatText text={project.description}></FormatText>
                </div>
              ))}
            </div>
          </div>
        );
      default: {
        // Handle custom sections
        const customSection = sectionsOrder.find(
          (section) => section === sectionName
        );
        if (customSection) {
          const sectionData = getCustomSectionData(
            resumeData.customSectionData,
            customSection
          );
          return (
            <div className="mt-3 w-full self-start">
              <p className="text-2xl">{customSection}</p>
              <hr className="w-full border-black"></hr>
              <div className="self-start">
                {sectionData?.items.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between">
                      <p className="text-[16px] font-semibold">
                        {item.heading}
                      </p>
                      <p className="text-[16px] text-rose-950">{item.date}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-[16px] leading-3 text-rose-950">
                        {item.subHeading}
                      </p>
                      <p className="text-[16px] italic text-rose-950">
                        {item.additionalInfo}
                      </p>
                    </div>
                    <FormatText text={item.description}></FormatText>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return null;
      }
    }
  }

  return (
    <div className="m-10 flex h-[297mm] w-[210mm] flex-col items-center overflow-hidden">
      <span className="text-[40px]">
        <p>{resumeData.fullName}</p>
      </span>
      <div className="flex gap-2 text-[16px]">
        <div className="flex">
          <img className="mr-[3px] h-4 w-4 self-center" src={emailIcon} />
          <p className="text-rose-950 underline">{resumeData.email}</p>
        </div>
        <div className="flex">
          <img className="mr-[3px] h-4 w-4 self-center" src={phoneIcon} />
          <p className="text-rose-950 underline">{resumeData.mobileNo}</p>
        </div>
        <div className="flex">
          <img
            className="mr-[3px] h-4 w-4 self-center"
            src={getSocialIcon(selectedSocial)}
          />
          <p className="text-rose-950 underline">{resumeData.socialLink}</p>
        </div>
      </div>

      {sectionsOrder.map((section, index) => {
        if (resumeData.includeSections[section]) {
          return (
            <div className="w-full text-[20px]" key={index}>
              {renderSection(section)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

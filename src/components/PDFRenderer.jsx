import emailIcon from '../assets/icons/cv-icons/email.png';
import phoneIcon from '../assets/icons/cv-icons/phone.png';
import linkedinIcon from '../assets/icons/cv-icons/linkedin.png';
import xIcon from '../assets/icons/cv-icons/x.png';
import BulletPointText from './ui/BulletPointText';

export default function PDFRenderer({
  resumeData,
  selectedSocial,
  sectionsOrder,
}) {
  function renderSection(sectionName) {
    switch (sectionName) {
      case 'education':
        return (
          <div className="self-start mt-3">
            <p className="text-2xl">Education</p>
            <hr className="w-full border-black"></hr>
            <div className="self-start">
              {resumeData.educationList.map((education, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <p className="font-semibold text-sm">
                      {education.institutionName}
                    </p>
                    <p className="text-rose-950 text-sm">{education.date}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-rose-950 text-sm leading-3">
                      {education.courseTitle}
                    </p>
                    <p className="text-rose-950 text-sm italic font-bold">
                      {education.grade}
                    </p>
                  </div>
                  <BulletPointText
                    text={education.description}
                  ></BulletPointText>
                </div>
              ))}
            </div>
          </div>
        );
      case 'professionalExperience':
        return (
          <div className="self-start mt-3 w-full">
            <p className="text-2xl">Professional Experience</p>
            <hr className="w-full border-black"></hr>
            <div className="self-start">
              {resumeData.experienceList.map((experience, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <p className="font-semibold text-sm">
                      {experience.companyName}
                    </p>
                    <p className="text-rose-950 text-sm">
                      {experience.date} •{' '}
                      <span className="font-semibold">
                        {experience.location}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-rose-950 text-sm leading-3">
                      {experience.jobTitle}
                    </p>
                    <p className="text-sm text-rose-950 italic">
                      {experience.skills.join(', ')}
                    </p>
                  </div>
                  <BulletPointText
                    text={experience.description}
                  ></BulletPointText>
                </div>
              ))}
            </div>
          </div>
        );
    }
  }

  return (
    <div className="flex flex-col items-center w-[168mm] h-[237.6mm] m-10">
      <span className="text-3xl">
        <p>{resumeData.fullName}</p>
      </span>
      <div className="flex gap-2">
        <div className="flex">
          <img className="w-4 h-4 self-center mr-[3px]" src={emailIcon} />
          <p className="text-rose-950 underline">{resumeData.email}</p>
        </div>
        <div className="flex">
          <img className="w-4 h-4 self-center mr-[3px]" src={phoneIcon} />
          <p className="text-rose-950 underline">{resumeData.mobileNo}</p>
        </div>
        <div className="flex">
          <img
            className="w-4 h-4 self-center mr-[3px]"
            src={selectedSocial == 'linkedin' ? linkedinIcon : xIcon}
          />
          <p className="text-rose-950 underline">{resumeData.socialLink}</p>
        </div>
      </div>

      {sectionsOrder.map((section, index) => {
        if (resumeData.includeSections[section]) {
          return <div key={index}>{renderSection(section)}</div>;
        }
        return null;
      })}
    </div>
  );
}

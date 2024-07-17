import emailIcon from '../assets/icons/cv-icons/email.png';
import phoneIcon from '../assets/icons/cv-icons/phone.png';
import linkedinIcon from '../assets/icons/cv-icons/linkedin.png';
import xIcon from '../assets/icons/cv-icons/x.png';

export default function PDFRenderer({ resumeData, selectedSocial }) {
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
      <div className="self-start mt-3">
        <p className="text-2xl">Education</p>
        <hr className="w-full border-black"></hr>
        <div className="self-start">
          <div className="flex justify-between">
            <p className="font-semibold text-sm">University of Leeds</p>
            <p className="text-rose-950 text-sm">
              Expected graduation date: Jun. 2026
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-rose-950 text-sm leading-3">
              B.Sc (Hons) in Computer Science
            </p>
            <p className="text-rose-950 text-sm italic font-bold">
              Predicted: First Class (1:1)
            </p>
          </div>
          <p className="text-sm">
            Relevant Courses: Procedural Programming (C), Fundamental
            Mathematics, Computer Architecture and Professional Computing
          </p>
        </div>
      </div>
      <div className="self-start mt-3">
        <p className="text-2xl">Professional Experience</p>
        <hr className="w-full border-black"></hr>
        <div className="self-start">
          <div className="flex justify-between">
            <p className="font-semibold text-sm">Apple</p>
            <p className="text-rose-950 text-sm">Feb. 2019 - Present</p>
          </div>
          <div className="flex justify-between">
            <p className="text-rose-950 text-sm leading-3">Software Engineer</p>
            <p className="text-sm text-rose-950 italic">Java, SwiftUI</p>
          </div>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis
            quibusdam libero ducimus eveniet porro alias nam totam, ea id unde a
            iusto aperiam officia necessitatibus quos illum, ullam corrupti.
            Omnis.
          </p>
        </div>
      </div>
    </div>
  );
}

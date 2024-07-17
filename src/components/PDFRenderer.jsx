import emailIcon from '../assets/icons/cv-icons/email.png';
import phoneIcon from '../assets/icons/cv-icons/phone.png';
import linkedinIcon from '../assets/icons/cv-icons/linkedin.png';
import xIcon from '../assets/icons/cv-icons/x.png';

export default function PDFRenderer({ resumeData, selectedSocial }) {
  return (
    <div className="flex flex-col items-center w-[168mm] h-[237.6mm] m-5">
      <span className="text-3xl">
        <p>{resumeData.fullName}</p>
      </span>
      <div className="flex gap-2">
        <div className="flex">
          <img className="w-4 h-4 self-center mr-[3px]" src={emailIcon} />
          <p className="underline">{resumeData.email}</p>
        </div>
        <div className="flex">
          <img className="w-4 h-4 self-center mr-[3px]" src={phoneIcon} />
          <p className="underline">{resumeData.mobileNo}</p>
        </div>
        <div className="flex">
          <img
            className="w-4 h-4 self-center mr-[3px]"
            src={selectedSocial == 'linkedin' ? linkedinIcon : xIcon}
          />
          <p className="underline">{resumeData.socialLink}</p>
        </div>
      </div>
    </div>
  );
}

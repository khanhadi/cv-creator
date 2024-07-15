export default function PDFRenderer({ resumeData }) {
  return (
    <div className="flex flex-col items-center w-[168mm] h-[237.6mm] m-5">
      <span className="text-3xl">
        <p>{resumeData.fullName}</p>
      </span>
      <div className="flex gap-2">
        <p>{resumeData.email}</p>
        <p>{resumeData.mobileNo}</p>
        <p>{resumeData.socialLink}</p>
      </div>
    </div>
  );
}

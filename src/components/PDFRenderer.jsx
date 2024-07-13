export default function PDFRenderer({ resumeData }) {
  return (
    <div className="flex flex-col items-center w-[168mm] h-[237.6mm] m-5">
      <div>
        <p>
          {resumeData.firstName} {resumeData.lastName}
        </p>
      </div>
    </div>
  );
}

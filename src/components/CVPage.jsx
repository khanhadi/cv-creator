export default function CVPage({ resumeData }) {
  return (
    <div className="cv-page h-[90%] w-11/12 max-w-full flex justify-center shadow-2xl bg-white">
      <h1>
        {resumeData.firstName} {resumeData.lastName}
      </h1>
    </div>
  );
}

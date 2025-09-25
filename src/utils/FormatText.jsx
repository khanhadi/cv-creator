export default function FormatText({ text }) {
  // Split the text by newline characters
  const lines = !text ? text : text.split('\n');
  return (
    <>
      {lines
        ? lines.map((line, index) => (
            <p key={index} className="break-words text-[14px]">
              {line}
            </p>
          ))
        : null}
    </>
  );
}

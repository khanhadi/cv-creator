export default function BulletPointText({ text }) {
  // Split the text by newline characters
  const lines = text.split('\n');

  return (
    <div>
      {lines.map((line, index) => (
        <p key={index} className="text-sm">
          • {line}
        </p>
      ))}
    </div>
  );
}

interface FormatTextProps {
  text: string
}

export default function FormatText({ text }: FormatTextProps) {
  const lines = text ? text.split('\n') : []
  return (
    <>
      {lines.map((line, index) => (
        <p key={index} className="break-words text-[14px]">
          {line}
        </p>
      ))}
    </>
  )
}

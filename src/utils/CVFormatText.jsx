import { Text } from '@react-pdf/renderer';

export default function CVFormatText({ text, style }) {
  // Split the text by newline characters
  const lines = !text ? text : text.split('\n');
  return (
    <>
      {lines
        ? lines.map((line, index) => (
            <Text style={style} key={index} className="text-sm">
              {line}
            </Text>
          ))
        : null}
    </>
  );
}

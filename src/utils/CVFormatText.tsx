import { Text } from '@react-pdf/renderer'
import type { TextProps } from '@react-pdf/renderer'

interface CVFormatTextProps {
  text: string
  style?: TextProps['style']
}

export default function CVFormatText({ text, style }: CVFormatTextProps) {
  const lines = text ? text.split('\n') : []
  return (
    <>
      {lines.map((line, index) => (
        <Text key={index} style={style}>
          {line}
        </Text>
      ))}
    </>
  )
}

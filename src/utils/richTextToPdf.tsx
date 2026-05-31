import React from 'react'
import { Text, View } from '@react-pdf/renderer'
import type { TextProps } from '@react-pdf/renderer'

type Style = TextProps['style']

interface RichTextPdfOptions {
  bodyStyle?: Style
}

export function richTextToPdf(
  content: string | null | undefined,
  options: RichTextPdfOptions = {},
): React.ReactElement {
  if (!content || !content.trim()) return <View />

  const lines = content.split('\n').filter((l) => l.trim())
  return (
    <View>
      {lines.map((line, i) => (
        <Text key={i} style={options.bodyStyle}>
          {line}
        </Text>
      ))}
    </View>
  )
}

import React from 'react'
import { Text, View } from '@react-pdf/renderer'
import type { TextProps } from '@react-pdf/renderer'

type Style = TextProps['style']

interface Options {
  bodyStyle?: Style
}

function normalizeToHtml(content: string): string {
  if (!content.trim()) return ''
  if (content.trimStart().startsWith('<')) return content
  return content
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^[-•*]\s/.test(line)) {
        return `<ul><li><p>${line.replace(/^[-•*]\s*/, '')}</p></li></ul>`
      }
      return `<p>${line}</p>`
    })
    .join('')
}

function renderInline(node: ChildNode, key: number): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? ''
  const el = node as Element
  const tag = el.tagName?.toLowerCase()
  if (tag === 'strong') return <Text key={key} style={{ fontWeight: 700 }}>{el.textContent}</Text>
  if (tag === 'em') return <Text key={key} style={{ fontStyle: 'italic' }}>{el.textContent}</Text>
  return el.textContent ?? ''
}

function renderBlock(el: Element, options: Options, key: number): React.ReactNode {
  const tag = el.tagName?.toLowerCase()

  if (tag === 'p') {
    const text = el.textContent?.trim()
    if (!text) return null
    return (
      <Text key={key} style={options.bodyStyle}>
        {Array.from(el.childNodes).map((n, i) => renderInline(n, i))}
      </Text>
    )
  }

  if (tag === 'ul' || tag === 'ol') {
    const items = Array.from(el.querySelectorAll(':scope > li'))
    if (!items.length) return null
    return (
      <View key={key}>
        {items.map((li, i) => {
          const pEl = li.querySelector('p')
          const inlineNodes = pEl
            ? Array.from(pEl.childNodes).map((n, j) => renderInline(n, j))
            : [li.textContent ?? '']
          return (
            <View key={i} style={{ flexDirection: 'row' }}>
              <Text style={Object.assign({}, options.bodyStyle, { width: 12 })}>{'•'}</Text>
              <Text style={Object.assign({}, options.bodyStyle, { flex: 1 })}>{inlineNodes}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  return null
}

export function richTextToPdf(
  content: string | null | undefined,
  options: Options = {},
): React.ReactElement {
  if (!content?.trim()) return <View />

  const html = normalizeToHtml(content)
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const blocks = Array.from(doc.body.children)
    .map((el, i) => renderBlock(el, options, i))
    .filter(Boolean)

  if (!blocks.length) return <View />
  return <View>{blocks}</View>
}

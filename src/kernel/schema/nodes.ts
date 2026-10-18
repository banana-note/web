import { Paragraph as TiptapParagraph } from '@tiptap/extension-paragraph'

export { Document as Doc } from '@tiptap/extension-document'
export { Text } from '@tiptap/extension-text'

// 允许装配时注册的 marks，不依赖任一具体 mark 必须存在。
export const Paragraph = TiptapParagraph.extend({ marks: '_' })

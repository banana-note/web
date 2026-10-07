import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'

/**
 * 内核自带的最小 schema 底线,结构固定为:
 *
 * ```
 * doc
 * └── paragraph
 *     └── text
 * ```
 *
 * 这个边界不是品味问题,是 ProseMirror 定的:schema 里必须至少有 `doc` 和 `text`,
 * 实用上再加 `paragraph` 作默认块容器。这就是下限。
 *
 * 这三个**不是扩展清单里的扩展**,配置关不掉。除它们之外内核不带任何节点或标记——
 * 加粗、标题、列表、图片、代码块全是扩展(architecture/web.md)。
 */
export const KERNEL_BUILTIN_EXTENSIONS = [Document, Paragraph, Text]

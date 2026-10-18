import { Doc, Paragraph, Text } from '../schema/nodes'

/**
 * 内核自带的最小 schema 底线,即 `doc > paragraph > text`(ProseMirror 要求至少有 `doc` 和 `text`)。
 *
 * 这是**可被扩展显式替换的默认集**,不是"配了就关不掉的东西";但它只可被改、不可被删,
 * 去掉任何一个编辑器都不能工作。见 ADR-0003。
 */
export const KERNEL_BUILTIN_EXTENSIONS = [Doc, Paragraph, Text]

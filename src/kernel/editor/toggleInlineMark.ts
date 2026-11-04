import type { Command } from '@tiptap/core'
import type { Mark, MarkType } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'

/** 共同的格式命令保护；使用调用方的 state/commands，保留 chain 与 can 的语义。 */
export const toggleInlineMark = (markType: MarkType): Command => ({ editor, view, state, commands }) => {
  const { selection, doc } = state

  if (!editor.isEditable || view.composing) return false
  if (
    !(selection instanceof TextSelection) ||
    !selection.$from.parent.type.allowsMarkType(markType) ||
    !selection.$to.parent.type.allowsMarkType(markType)
  ) return false

  // 与原生 Mark.addToSet 一致：新 mark 排斥旧 mark 时可替换；反向排斥才阻止添加。
  const blocksMark = (marks: readonly Mark[]) => marks.some((mark) => (
    mark.type.excludes(markType) && !markType.excludes(mark.type)
  ))

  if (selection.empty && blocksMark(state.storedMarks ?? selection.$from.marks())) return false

  let allowed = true
  if (!selection.empty) {
    doc.nodesBetween(selection.from, selection.to, (node) => {
      if (!allowed) return false
      if (node.isTextblock && !node.type.allowsMarkType(markType)) allowed = false
      if (node.isInline && blocksMark(node.marks)) allowed = false
      return allowed && !node.isInline
    })
  }
  if (!allowed) return false

  return commands.toggleMark(markType)
}

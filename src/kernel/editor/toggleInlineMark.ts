import type { Editor } from '@tiptap/core'
import type { Mark, MarkType } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'

/** 编辑器内的格式快捷键入口；返回 true 表示消费按键，不代表发生了内容修改。 */
export function toggleInlineMark(editor: Editor, markType: MarkType): boolean {
  const { view, state } = editor
  const { selection, doc } = state

  if (!editor.isEditable || !view.hasFocus() || view.composing) return true
  if (
    !(selection instanceof TextSelection) ||
    !selection.$from.parent.type.allowsMarkType(markType) ||
    !selection.$to.parent.type.allowsMarkType(markType)
  ) return true

  // 与原生 Mark.addToSet 一致：新 mark 排斥旧 mark 时可替换；反向排斥才阻止添加。
  const blocksMark = (marks: readonly Mark[]) => marks.some((mark) => (
    mark.type.excludes(markType) && !markType.excludes(mark.type)
  ))

  if (selection.empty && blocksMark(state.storedMarks ?? selection.$from.marks())) return true

  let allowed = true
  if (!selection.empty) {
    doc.nodesBetween(selection.from, selection.to, (node) => {
      if (!allowed) return false
      if (node.isTextblock && !node.type.allowsMarkType(markType)) allowed = false
      if (node.isInline && blocksMark(node.marks)) allowed = false
      return allowed && !node.isInline
    })
  }
  if (!allowed) return true

  editor.commands.toggleMark(markType)
  return true
}

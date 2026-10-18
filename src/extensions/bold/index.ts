import { Mark } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

export const Bold = Mark.create({
  name: 'bold',

  parseHTML: () => [{ tag: 'strong' }],
  renderHTML: ({ HTMLAttributes }) => ['strong', HTMLAttributes, 0],

  addKeyboardShortcuts() {
    return {
      'Mod-b': () => {
        const { editor } = this
        const { view, state } = editor
        const { selection, doc } = state

        // 无效操作也消费按键，避免浏览器原生加粗绕过正文限制。
        if (!editor.isEditable || !view.hasFocus() || view.composing) return true
        if (
          !(selection instanceof TextSelection) ||
          selection.$from.parent.type.name !== 'paragraph' ||
          selection.$to.parent.type.name !== 'paragraph'
        ) return true

        let onlyParagraphs = true
        doc.nodesBetween(selection.from, selection.to, (node) => {
          if (node.isTextblock && node.type.name !== 'paragraph') onlyParagraphs = false
          return !node.isTextblock
        })
        if (!onlyParagraphs) return true

        return editor.commands.toggleMark(this.name)
      },
    }
  },
})

import { Mark } from '@tiptap/core'

import { toggleInlineMark } from '../../kernel'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    italic: {
      /** 切换逻辑选区的斜体；不主动改变焦点。 */
      toggleItalic: () => ReturnType
    }
  }
}

export const Italic = Mark.create({
  name: 'italic',

  parseHTML: () => [{ tag: 'em' }, { tag: 'i' }],
  renderHTML: ({ HTMLAttributes }) => ['em', HTMLAttributes, 0],

  addCommands() {
    return { toggleItalic: () => toggleInlineMark(this.type) }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-i': () => {
        if (this.editor.view.hasFocus() && this.editor.can().toggleItalic()) this.editor.commands.toggleItalic()
        return true
      },
    }
  },
})

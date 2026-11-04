import { Mark } from '@tiptap/core'

import { toggleInlineMark } from '../../kernel'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bold: {
      /** 切换逻辑选区的加粗；不主动改变焦点。 */
      toggleBold: () => ReturnType
    }
  }
}

export const Bold = Mark.create({
  name: 'bold',

  parseHTML: () => [{ tag: 'strong' }],
  renderHTML: ({ HTMLAttributes }) => ['strong', HTMLAttributes, 0],

  addCommands() {
    return { toggleBold: () => toggleInlineMark(this.type) }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-b': () => {
        if (this.editor.view.hasFocus() && this.editor.can().toggleBold()) this.editor.commands.toggleBold()
        return true
      },
    }
  },
})

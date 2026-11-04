import { Mark } from '@tiptap/core'

import { toggleInlineMark } from '../../kernel'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    strike: {
      /** 切换逻辑选区的删除线；不主动改变焦点。 */
      toggleStrike: () => ReturnType
    }
  }
}

export const Strike = Mark.create({
  name: 'strike',

  parseHTML: () => [{ tag: 's' }, { tag: 'del' }, { tag: 'strike' }],
  renderHTML: ({ HTMLAttributes }) => ['s', HTMLAttributes, 0],

  addCommands() {
    return { toggleStrike: () => toggleInlineMark(this.type) }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-s': () => {
        if (this.editor.view.hasFocus() && this.editor.can().toggleStrike()) this.editor.commands.toggleStrike()
        return true
      },
    }
  },
})

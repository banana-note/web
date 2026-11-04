import { Mark } from '@tiptap/core'

import { toggleInlineMark } from '../../kernel'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    code: {
      /** 切换逻辑选区的行内代码；遵守格式互斥，不主动改变焦点。 */
      toggleCode: () => ReturnType
    }
  }
}

export const Code = Mark.create({
  name: 'code',
  excludes: '_',
  code: true,

  parseHTML: () => [{ tag: 'code' }],
  renderHTML: ({ HTMLAttributes }) => ['code', HTMLAttributes, 0],

  addCommands() {
    return { toggleCode: () => toggleInlineMark(this.type) }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-e': () => {
        if (this.editor.view.hasFocus() && this.editor.can().toggleCode()) this.editor.commands.toggleCode()
        return true
      },
    }
  },
})

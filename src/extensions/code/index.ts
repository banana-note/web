import { Mark } from '@tiptap/core'

import { toggleInlineMark } from '../../kernel'

export const Code = Mark.create({
  name: 'code',
  excludes: '_',
  code: true,

  parseHTML: () => [{ tag: 'code' }],
  renderHTML: ({ HTMLAttributes }) => ['code', HTMLAttributes, 0],

  addKeyboardShortcuts() {
    return {
      'Mod-e': () => toggleInlineMark(this.editor, this.editor.schema.marks[this.name]),
    }
  },
})

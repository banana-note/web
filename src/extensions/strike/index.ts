import { Mark } from '@tiptap/core'

import { toggleInlineMark } from '../../kernel'

export const Strike = Mark.create({
  name: 'strike',

  parseHTML: () => [{ tag: 's' }, { tag: 'del' }, { tag: 'strike' }],
  renderHTML: ({ HTMLAttributes }) => ['s', HTMLAttributes, 0],

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-s': () => toggleInlineMark(this.editor, this.editor.schema.marks[this.name]),
    }
  },
})

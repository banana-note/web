import { Mark } from '@tiptap/core'

import { toggleInlineMark } from '../../kernel'

export const Italic = Mark.create({
  name: 'italic',

  parseHTML: () => [{ tag: 'em' }, { tag: 'i' }],
  renderHTML: ({ HTMLAttributes }) => ['em', HTMLAttributes, 0],

  addKeyboardShortcuts() {
    return {
      'Mod-i': () => toggleInlineMark(this.editor, this.editor.schema.marks[this.name]),
    }
  },
})

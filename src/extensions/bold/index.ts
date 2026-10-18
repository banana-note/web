import { Mark } from '@tiptap/core'

import { toggleInlineMark } from '../../kernel'

export const Bold = Mark.create({
  name: 'bold',

  parseHTML: () => [{ tag: 'strong' }],
  renderHTML: ({ HTMLAttributes }) => ['strong', HTMLAttributes, 0],

  addKeyboardShortcuts() {
    return {
      'Mod-b': () => toggleInlineMark(this.editor, this.editor.schema.marks[this.name]),
    }
  },
})

import { InputRule, Node } from '@tiptap/core'
import { TextSelection, type EditorState } from '@tiptap/pm/state'

const LEVELS = [1, 2, 3, 4, 5, 6] as const
export type HeadingLevel = (typeof LEVELS)[number]

function isHeadingLevel(value: unknown): value is HeadingLevel {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 6
}

function validateLevel(value: unknown): void {
  if (!isHeadingLevel(value)) throw new RangeError('Heading level must be an integer from 1 to 6')
}

function isBodySelection({ selection, doc }: EditorState): boolean {
  if (!(selection instanceof TextSelection)) return false

  const isBodyBlock = (name: string) => name === 'paragraph' || name === 'heading'
  if (!isBodyBlock(selection.$from.parent.type.name) || !isBodyBlock(selection.$to.parent.type.name)) {
    return false
  }

  let allowed = true
  doc.nodesBetween(selection.from, selection.to, (node) => {
    if (node.isTextblock && !isBodyBlock(node.type.name)) allowed = false
    return !node.isTextblock
  })
  return allowed
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    heading: {
      setHeading: (attributes: { level: HeadingLevel }) => ReturnType
      toggleHeading: (attributes: { level: HeadingLevel }) => ReturnType
    }
  }
}

export const Heading = Node.create({
  name: 'heading',
  group: 'block',
  content: 'inline*',
  marks: '',
  defining: true,

  addAttributes: () => ({
    level: {
      default: 1,
      rendered: false,
      validate: validateLevel,
      // HTML 级别只来自标签，不接受外部 level 属性覆盖它。
      parseHTML: () => null,
    },
  }),

  parseHTML: () => LEVELS.map((level) => ({
    tag: `h${level}:not([data-note-title])`,
    attrs: { level },
  })),

  renderHTML({ node, HTMLAttributes }) {
    validateLevel(node.attrs.level)
    return [`h${node.attrs.level}`, HTMLAttributes, 0]
  },

  addCommands() {
    return {
      setHeading: (attributes) => ({ editor, state, commands }) => {
        if (
          !isHeadingLevel(attributes.level) || !editor.isEditable || editor.view.composing ||
          !isBodySelection(state)
        ) return false

        return commands.setNode(this.name, attributes)
      },
      toggleHeading: (attributes) => ({ editor, state, commands }) => {
        if (
          !isHeadingLevel(attributes.level) || !editor.isEditable || editor.view.composing ||
          !isBodySelection(state)
        ) return false

        return commands.toggleNode(this.name, 'paragraph', attributes)
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      ...Object.fromEntries(LEVELS.map((level) => [
        `Ctrl-${level}`,
        () => {
          if (this.editor.view.hasFocus()) this.editor.commands.toggleHeading({ level })
          // 只处理宿主实际送达编辑器的按键；无法覆盖浏览器保留的标签页快捷键。
          return true
        },
      ])),
      Enter: () => {
        const { editor } = this
        const { selection } = editor.state
        if (
          !(selection instanceof TextSelection) || !selection.empty ||
          selection.$from.parent.type.name !== this.name || selection.$from.parent.content.size > 0
        ) return false

        if (!editor.isEditable || !editor.view.hasFocus() || editor.view.composing) return true
        // core 在空 Heading 中会再插入段落；这里按约定将原块直接恢复为段落。
        return editor.commands.setParagraph()
      },
    }
  },

  addInputRules() {
    return [new InputRule({
      find: /^(#{1,6}) $/,
      handler: ({ state, range, match }) => {
        const { editor } = this
        const { selection } = state
        const $start = state.doc.resolve(range.from)
        const level = match[1].length

        if (
          !editor.isEditable || !editor.view.hasFocus() || editor.view.composing ||
          !selection.empty || $start.parent.type.name !== 'paragraph' ||
          $start.parentOffset !== 0 || !isHeadingLevel(level) ||
          !$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), this.type)
        ) return null

        state.tr.delete(range.from, range.to).setBlockType(range.from, range.from, this.type, { level })
      },
    })]
  },
})

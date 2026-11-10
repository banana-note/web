import { Extension } from '@tiptap/core'
import { keydownHandler } from '@tiptap/pm/keymap'
import { AllSelection, Plugin, TextSelection } from '@tiptap/pm/state'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    clearInlineFormatting: {
      clearInlineFormatting: () => ReturnType
    }
  }
}

export const ClearInlineFormatting = Extension.create({
  name: 'clearInlineFormatting',

  addCommands() {
    return {
      clearInlineFormatting: () => ({ editor, state, commands }) => {
        const { doc, selection } = state
        if (
          !editor.isEditable || editor.view.composing || selection.empty ||
          !(selection instanceof TextSelection || selection instanceof AllSelection)
        ) return false

        const { nonClearableMarks } = editor.extensionManager
        let hasFormatting = false
        doc.nodesBetween(selection.from, selection.to, (node) => {
          if (hasFormatting) return false
          if (!node.isInline) return true
          hasFormatting = node.marks.some(mark => !nonClearableMarks.includes(mark.type.name))
          return false
        })
        return hasFormatting && commands.unsetAllMarks()
      },
    }
  },

  addProseMirrorPlugins() {
    const { editor } = this
    const handleShortcut = keydownHandler({
      'Mod-\\': (_state, _dispatch, view) => {
        if (!editor.isEditable || !view?.hasFocus() || view.composing) return false
        if (editor.can().clearInlineFormatting()) editor.commands.clearInlineFormatting()
        return true
      },
    })

    return [new Plugin({
      props: {
        handleKeyDown: (view, event) => !event.isComposing && handleShortcut(view, event),
      },
    })]
  },
})

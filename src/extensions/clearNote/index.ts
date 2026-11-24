import { Extension, type Editor } from '@tiptap/core'
import { closeHistory } from '@tiptap/pm/history'
import { AllSelection, Plugin, PluginKey, TextSelection } from '@tiptap/pm/state'

const clearNoteKey = new PluginKey('clearNote')

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    clearNote: {
      clearNote: () => ReturnType
    }
  }
}

function isWholeNoteSelected(editor: Editor): boolean {
  const { doc, selection } = editor.state
  return selection instanceof AllSelection &&
    doc.firstChild?.type.name === 'title' && doc.childCount > 1
}

export const ClearNote = Extension.create({
  name: 'clearNote',

  addCommands() {
    return {
      clearNote: () => ({ editor, state, dispatch }) => {
        const title = state.schema.nodes.title
        const paragraph = state.schema.nodes.paragraph
        if (
          !editor.isEditable || editor.view.composing || !isWholeNoteSelected(editor) || !title || !paragraph
        ) return false

        if (!dispatch) return true

        const emptyTitle = title.create()
        const emptyNote = state.schema.node('doc', null, [emptyTitle, paragraph.create()])
        const transaction = state.tr.replaceWith(0, state.doc.content.size, emptyNote.content)
        transaction.setSelection(TextSelection.near(transaction.doc.resolve(1)))
        dispatch(closeHistory(transaction.setMeta(clearNoteKey, true).scrollIntoView()))
        return true
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: clearNoteKey,
        appendTransaction(transactions, _oldState, newState) {
          if (!transactions.some(tr => tr.getMeta(clearNoteKey))) return null
          // Start a fresh undo group for anything typed after clearing.
          return closeHistory(newState.tr)
        },
      }),
    ]
  },

  addKeyboardShortcuts() {
    const clearIfWholeNoteSelected = () => {
      const { editor } = this
      if (!isWholeNoteSelected(editor)) return false
      return editor.commands.clearNote()
    }

    return {
      Backspace: clearIfWholeNoteSelected,
      Delete: clearIfWholeNoteSelected,
    }
  },
})

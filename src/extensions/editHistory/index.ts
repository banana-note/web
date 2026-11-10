import { Extension } from '@tiptap/core'
import { history, redo, undo } from '@tiptap/pm/history'
import { keydownHandler } from '@tiptap/pm/keymap'
import { Plugin, type Command } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

function runHistory(view: EditorView, command: Command): boolean {
  if (!view.editable || !view.hasFocus() || view.composing) return false
  command(view.state, view.dispatch)
  // Once the editor owns the shortcut, never let the browser undo its DOM.
  return true
}

const shortcut = (command: Command): Command =>
  (_state, _dispatch, view) => !!view && runHistory(view, command)

const handleHistoryKey = keydownHandler({
  'Mod-z': shortcut(undo),
  'Mod-Shift-z': shortcut(redo),
  'Mod-y': shortcut(redo),
})

export const EditHistory = Extension.create({
  name: 'editHistory',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => !event.isComposing && handleHistoryKey(view, event),
          handleDOMEvents: {
            beforeinput(view, event) {
              const { inputType, isComposing } = event as InputEvent
              const command = inputType === 'historyUndo' ? undo : inputType === 'historyRedo' ? redo : null
              if (!command) return false

              // Intercept before history()'s built-in handler, which only checks editability.
              if (event.cancelable) {
                event.preventDefault()
                if (!isComposing) runHistory(view, command)
              }
              return true
            },
          },
        },
      }),
      history(),
    ]
  },
})

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey, type Selection } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

/**
 * 给块打两个**纯事实**标记,不含任何策略——哪个块该显示什么由 `index.css` 决定:
 *
 * - `is-empty`:这个文本块是空的
 * - `has-caret`:编辑器有焦点,且光标正落在这个块里
 *
 * 类名与 `src/index.css` 的选择器**必须成对**,改一边就得改另一边。这是本文件唯一的对外契约。
 *
 * 焦点这一半必须读 selection:CSS 的 `:focus` 问不出"哪个块里有光标",因为 contenteditable
 * 的焦点永远落在编辑器根上。完整理由见 docs/design/note-empty-state.md。
 */
const emptyBlockMarkerKey = new PluginKey('emptyBlockMarker')

export const EmptyBlockMarker = Extension.create({
  name: 'emptyBlockMarker',

  addProseMirrorPlugins() {
    // 不用 `this.editor.isFocused`:那是 focusEvents 扩展维护的缓存字段,只在
    // `enableCoreExtensions` 打开时才存在,依赖它等于把正确性挂在"另一个扩展恰好注册了"上。
    let focused = false

    return [
      new Plugin({
        key: emptyBlockMarkerKey,

        props: {
          decorations(state) {
            const { doc, selection } = state
            const caret = caretBlockPos(selection, focused)
            const decorations: Decoration[] = []

            doc.descendants((node, pos) => {
              if (!node.isTextblock) return true

              const from = pos
              const to = pos + node.nodeSize

              if (node.content.size === 0) {
                decorations.push(Decoration.node(from, to, { class: 'is-empty' }))
              }
              if (pos === caret) {
                decorations.push(Decoration.node(from, to, { class: 'has-caret' }))
              }

              // 文本块的孩子全是 inline,不可能再藏着文本块,不必下钻
              return false
            })

            return DecorationSet.create(doc, decorations)
          },

          handleDOMEvents: {
            // 焦点变化不产生 transaction,装饰不会自己刷新,所以得自己派发一次。
            // 这个事务不带任何 step,唯一目的是让 state 变一变以触发重算。
            focus: (view) => {
              focused = true
              view.dispatch(view.state.tr.setMeta(emptyBlockMarkerKey, 'focus'))
              return false // 不拦截:tiptap 自己的 focusEvents 还要用这个事件
            },
            blur: (view) => {
              focused = false
              view.dispatch(view.state.tr.setMeta(emptyBlockMarkerKey, 'blur'))
              return false
            },
          },
        },
      }),
    ]
  },
})

/**
 * 光标所在**文本块**的起始位置;没有焦点、或光标不在文本块里时返回 `-1`。
 *
 * 返回值要和 `doc.descendants` 给的 `pos` 直接比较,所以是"块的起始位置"而不是光标的位置。
 */
function caretBlockPos(selection: Selection, focused: boolean): number {
  if (!focused) return -1

  const { $from } = selection
  // 这一问同时挡掉"焦点在编辑器外"和"整个块被 NodeSelection 选中"两种情况
  if (!$from.parent.isTextblock) return -1

  return $from.before($from.depth)
}

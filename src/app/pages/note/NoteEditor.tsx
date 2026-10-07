import { EditorContent, useEditor } from '@tiptap/react'

import { buildEditorOptions, KERNEL_BUILTIN_EXTENSIONS, type Note } from '../../../kernel'

interface NoteEditorProps {
  readonly note: Note
}

/**
 * 正文编辑区。
 *
 * 这里是 Editor **实例**的归属地:内核只产出配置(`buildEditorOptions`),
 * 创建与挂载由 `app/` 负责。见 ADR-0002。
 */
export function NoteEditor({ note }: NoteEditorProps) {
  const editor = useEditor(
    buildEditorOptions({
      extensions: KERNEL_BUILTIN_EXTENSIONS,
      content: note.content,
      onContentError: ({ error }) => {
        /*
         * 这里**只报错,不做任何补救**。
         *
         * 此刻正文已经退化成空文档了,唯一的正确反应是把这件事喊出来。
         * 尤其**不能触发保存**——那等于用空白覆盖用户内容(见 NoteStore.save)。
         *
         * 也不能改回抛出:这个回调是在 `new Editor()` 内部被调用的,
         * 而 `new Editor()` 发生在 render 期间,抛出去会让整页白屏。
         */
        console.error('[note-editor] 正文解析失败,内容已退化为空文档,未做保存。', error)
      },
    }),
    /*
     * deps 必须非空。
     *
     * `useEditor` 在 `deps.length === 0` 时走 `setOptions` 路径——那条路径
     * **既不重建 schema,也不重新应用 content**。所以传空数组的话,
     * 将来切到另一篇笔记时,编辑器会静默保留上一篇的内容,而且不报任何错。
     *
     * 传了 deps 之后,值变化会触发 destroy + createEditor 的完整重建,
     * content 才会真的换成新笔记的。
     */
    [note.id],
  )

  return <EditorContent editor={editor} />
}

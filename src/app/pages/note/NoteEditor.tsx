import { EditorContent, useEditor } from '@tiptap/react'

import { Bold } from '../../../extensions/bold'
import { Code } from '../../../extensions/code'
import { Heading } from '../../../extensions/heading'
import { Italic } from '../../../extensions/italic'
import { Strike } from '../../../extensions/strike'
import { titleExtensions } from '../../../extensions/title'
import {
  buildEditorOptions,
  composeExtensions,
  EmptyBlockMarker,
  KERNEL_BUILTIN_EXTENSIONS,
  type Note,
} from '../../../kernel'

// 「开哪些扩展」的唯一答案——判断"开哪些"是 app 的职责,清单则由扩展自己给出。
// 提成模块常量是因为它不依赖 props,放在组件里每次 render 重算没有意义。
const EXTENSIONS = composeExtensions(KERNEL_BUILTIN_EXTENSIONS, [
  ...titleExtensions,
  Bold,
  Italic,
  Strike,
  Code,
  Heading,
  EmptyBlockMarker,
])

interface NoteEditorProps {
  readonly note: Note
}

/** 正文编辑区:Editor 实例的归属地。内核只产出配置,创建与挂载由 `app/` 负责(ADR-0002)。 */
export function NoteEditor({ note }: NoteEditorProps) {
  const editor = useEditor(
    buildEditorOptions({
      extensions: EXTENSIONS,
      content: note.content,

      // 这里**只报错,不做任何补救**:此刻正文已经退化成空文档了,唯一的正确反应是把它喊出来。
      // 尤其不能触发保存,也不能改回抛出——`new Editor()` 发生在 render 期间,抛出去会白屏。
      onContentError: ({ error }) => {
        console.error('[note-editor] 正文解析失败,内容已退化为空文档,未做保存。', error)
      },
    }),

    // deps 必须非空:`useEditor` 在 `deps.length === 0` 时走 `setOptions`,那条路径既不重建
    // schema 也不重新应用 content。而 deps 相等时 `refreshEditorInstance` 直接 return,
    // 所以 `[note.id]` 只保证**换笔记**会重建;同一 id 下 content 变了不会被应用(接
    // `NoteStore` 后重新拉取同一篇时要连 content 一起进 deps)。
    [note.id],
  )

  return <EditorContent editor={editor} />
}

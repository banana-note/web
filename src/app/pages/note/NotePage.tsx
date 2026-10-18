import type { JSONContent } from '@tiptap/core'

import { CODE_SCHEMA_VERSION, type Note } from '../../../kernel'
import { NoteEditor } from './NoteEditor'

/**
 * 一篇空笔记的正文。显式带上 `title`,不能写成 `{ type: 'doc' }`——那不满足 `doc` 的
 * content 表达式,在 `enableContentCheck: true` 下会被判为非法内容;而空 title 是必需的,
 * 「无标题」占位符要有个节点才挂得上去。见 docs/design/note-empty-state.md。
 */
const EMPTY_CONTENT: JSONContent = {
  type: 'doc',
  content: [{ type: 'title' }, { type: 'paragraph' }],
}

export function NotePage() {
  // 持久化的落点:接 `NoteStore` 时只换这一处。
  const note: Note = {
    id: 'local',
    schemaVersion: CODE_SCHEMA_VERSION,
    content: EMPTY_CONTENT,
  }

  return (
    <main className="min-h-screen bg-bg">
      {/* 752 = gutter 32 + 文本 720;gutter 现在就留出来,块手柄落地时不用改列宽 */}
      <div className="mx-auto w-[752px] pt-16 pl-8">
        <NoteEditor note={note} />
      </div>
    </main>
  )
}

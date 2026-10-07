import type { JSONContent } from '@tiptap/core'

import type { Note } from '../../../kernel'
import { NoteEditor } from './NoteEditor'

/**
 * 一篇空笔记的正文。
 *
 * 显式写成 `doc > paragraph`,而不是 `{ type: 'doc' }`——后者不满足 `doc` 的
 * content 表达式 `paragraph+`,在 `enableContentCheck: true` 下会被判为非法内容。
 * 这也正是持久化时会存进去的形状。
 */
const EMPTY_CONTENT: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

/**
 * 笔记编辑页的容器。
 *
 * 本轮很薄:没有持久化、没有标题、不切换笔记,所以这里只有一个常量。
 * 它是**标题扩展与持久化的落点**——接 `NoteStore` 时只换这一处。
 */
export function NotePage() {
  const note: Note = {
    id: 'local',
    schemaVersion: 1,
    content: EMPTY_CONTENT,
  }

  return (
    <main className="min-h-screen bg-bg">
      {/*
        正文列几何:752 = [gutter 32] + [文本 720],居中。
        gutter 现在就留出来,是为了块手柄(BlockHandle)落地时不用改列宽。
      */}
      <div className="mx-auto w-[752px] pt-16 pl-8">
        <NoteEditor note={note} />
      </div>
    </main>
  )
}

import type { JSONContent } from '@tiptap/core'

/**
 * 一篇笔记。
 *
 * `content` 是 ProseMirror JSON,**唯一真相源**。导出 HTML / Markdown 是单向有损的,
 * 不允许回流成正文(architecture/web.md 全局不变式 #6)。
 *
 * 注意这里**没有** `title`。标题由扩展实现为 ProseMirror 节点,不是笔记上的独立字段
 * (见 docs/glossary.md)。
 */
export interface Note {
  readonly id: string

  /**
   * 正文对应的 schema 版本。
   *
   * 必须带,否则将来无法判断一篇旧笔记该怎么迁移(architecture/web.md)。
   * 因为墓碑原则——schema 只能加不能减——这个值是单调递增的。
   */
  readonly schemaVersion: number

  readonly content: JSONContent
}

/**
 * 笔记的读写。**内核只定义,不实现**;HTTP 实现作为注入项
 * (architecture/web.md「持久化」)。
 *
 * 本轮没有任何实现,也没有调用方。
 *
 * ⚠️ 将来实现时有一条硬约束:`save` **绝不能**被 `onContentError` 回调触发。
 * 内容解析失败时 tiptap 会把正文退化成空文档,此时保存等于用空白覆盖用户内容。
 * 详见 docs/design/note-editor.md 的「错误处理」。
 */
export interface NoteStore {
  load(id: string): Promise<Note>
  save(note: Note): Promise<Note>
}

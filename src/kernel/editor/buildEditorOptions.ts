import type { AnyExtension, EditorOptions, JSONContent } from '@tiptap/core'

export interface BuildEditorOptionsInput {
  /** 本次会话要装配的扩展,内核底线是 `KERNEL_BUILTIN_EXTENSIONS`。 */
  readonly extensions: readonly AnyExtension[]

  readonly content?: JSONContent

  /**
   * 内容解析失败时的回调。
   *
   * **必须是不可抛的**:它在 `new Editor()` 内部被调用,而后者发生在 React render 期间。
   * 另外这个回调里**绝不能触发保存**(见 `NoteStore.save`)。
   */
  readonly onContentError: NonNullable<EditorOptions['onContentError']>
}

/**
 * 组装 Editor 的配置。这是内核与框架之间唯一的接缝——内核决定 Editor「是什么」,
 * `app/` 决定它「何时存在」(ADR-0002)——所以本函数零 React 依赖,由 `.oxlintrc.json` 保证。
 */
export function buildEditorOptions(input: BuildEditorOptionsInput): Partial<EditorOptions> {
  return {
    extensions: [...input.extensions],
    content: input.content,

    /*
     * 默认 false 时,解析失败只打一条 console.warn 然后静默换成空文档。
     * 打开它换来的是「失败绝不静默」,但**并不保住内容**——tiptap 内部仍会退化成空文档。
     */
    enableContentCheck: true,

    onContentError: input.onContentError,
  }
}

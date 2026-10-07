import type { AnyExtension, EditorOptions, JSONContent } from '@tiptap/core'

export interface BuildEditorOptionsInput {
  /** 本次会话要装配的扩展。内核自带底线 = `KERNEL_BUILTIN_EXTENSIONS`。 */
  readonly extensions: readonly AnyExtension[]

  /** 初始正文。 */
  readonly content?: JSONContent

  /**
   * 内容解析失败时的回调。
   *
   * **必须是不可抛的。** 原因见下面 `enableContentCheck` 的注释——抛出去会从
   * `new Editor()` 里冒出来,而 `new Editor()` 发生在 React render 期间。
   *
   * 另外,**这个回调里绝不允许触发保存**(见 `NoteStore.save` 的说明)。
   */
  readonly onContentError: NonNullable<EditorOptions['onContentError']>
}

/**
 * 组装 Editor 的配置。
 *
 * 这是内核与框架之间唯一的接缝:**内核决定 Editor「是什么」,`app/` 决定它「何时存在」**(ADR-0002)。
 * 所以本函数是纯的、零 React 依赖,产出物可以被任何消费者使用——
 * `.oxlintrc.json` 里有规则禁止 `src/kernel/**` import React,让这条边界不靠自觉。
 *
 * schema 在这里定稿。ProseMirror 的 schema 在 Editor 创建后**不可变**,
 * 所以装配顺序里「合成 schema」必须排在 `new Editor()` 之前(architecture/web.md)。
 */
export function buildEditorOptions(input: BuildEditorOptionsInput): Partial<EditorOptions> {
  return {
    extensions: [...input.extensions],
    content: input.content,

    /*
     * 默认是 false。开着它,tiptap 会在解析内容时调用 `node.check()` 做一次校验。
     *
     * 不开的话,`createNodeFromContent` 会 catch 住 "Unknown node type" 一类的错误,
     * 只打一条 console.warn,然后**返回一个空文档**。用户看到的是空白笔记,
     * 接着可能一保存就把真内容覆盖了——静默的数据丢失。
     *
     * ⚠️ 但要清楚它买到了什么:开着它,**内容仍然会退化成空文档**(tiptap 内部
     * 会用一个 fallback doc 兜底),我们只是**收到通知**。它唯一的保证是
     * 「失败绝不静默」,不是「内容保得住」。
     */
    enableContentCheck: true,

    onContentError: input.onContentError,
  }
}

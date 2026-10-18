import { TextSelection, type Command } from '@tiptap/pm/state'

import { Paragraph } from '../../kernel'

/**
 * 标题里的 Enter。
 *
 * 标题是 `isolating` 的(见 `index.ts`),内核那三条 Enter 命令在标题里全部返回 false,
 * 所以 Enter 本来是按了没反应。这个命令把那一键接回来:
 *
 * - 光标在标题**中间** → 吞掉按键,什么都不发生
 * - 光标在标题**末尾** → 在正文开头插入一个空段落,光标落进去
 * - 不在标题里 → 返回 `false`,交给内核的 Enter
 */
export const enterFromTitle: Command = (state, dispatch) => {
  const { selection, schema } = state
  const { $from, empty } = selection

  // title 的 content 是 `inline*`,光标直接落在 `doc` 的孩子里,不会有中间层级
  if (!empty || $from.depth !== 1 || $from.parent.type.name !== 'title') return false

  // 「中间」必须返回 `true` 而不是 `false`:返回 false 等于"这个键没人管",会放行浏览器
  // 默认行为往 `<h1>` 里塞 `<br>`,而 `inline*` 没有 hardBreak 接得住。true 才阻止默认行为。
  if ($from.parentOffset < $from.parent.content.size) return true

  // `$from.after()` 是标题节点之后的位置,也就是正文的开头
  if (dispatch) {
    const at = $from.after()
    const tr = state.tr.insert(at, schema.nodes[Paragraph.name].create())
    tr.setSelection(TextSelection.near(tr.doc.resolve(at + 1)))
    dispatch(tr.scrollIntoView())
  }

  return true
}

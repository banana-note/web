import { Node } from '@tiptap/core'

import { Doc } from '../../kernel'
import { enterFromTitle } from './enterFromTitle'

/**
 * 笔记标题。**全篇至多一个**,这一点与正文里可以有无数个的 `Heading` 是两个概念
 * (中文都能叫"标题",所以代码名必须分开,见 docs/glossary.md)。
 */
const Title = Node.create({
  name: 'title',
  content: 'inline*',
  marks: '',

  // 刻意**不声明 `group`**:一旦进了 `block` 组,`doc` 的 `block+` 就会无条件收下它,
  // 「至多一个、必须在最前」会无声蒸发。约束靠下面 `DocWithTitle` 的 content 表达式表达。
  //
  // `isolating` 挡的是"正文被吞进标题"(joinBackward 会把段落并进标题且不报错)。
  // 代价是内核那三条 Enter 命令全部拒绝 isolating 节点,所以下面把 Enter 接回来。
  isolating: true,

  // `data-note-title` 用来和将来 `Heading` 扩展产出的 `h1` 区分开——光凭标签名分辨不了。
  // `mb-6` 是标题与正文的间距(Figma `space/24`,映射规则 `space/N` ↔ 类名 `N/4`)。
  parseHTML: () => [{ tag: 'h1[data-note-title]' }],
  renderHTML: () => ['h1', { 'data-note-title': '', class: 'text-title font-bold text-ink mb-6' }, 0],

  addKeyboardShortcuts: () => ({
    Enter: ({ editor }) => enterFromTitle(editor.state, (tr) => editor.view.dispatch(tr)),
  }),
})

/**
 * 覆盖内核的 `doc`,把 content 从 `block+` 收紧成 `(title block*) | block+`:
 * 要么以 title 开头,要么一个 title 都没有——空标题是合法的,所以 `|` 那一半不能少。
 */
const DocWithTitle = Doc.extend({ content: '(title block*) | block+' })

/**
 * 这两个**必须一起注册**:`doc` 的表达式点名了 `title`,schema 里没有 `title` 节点时建 schema
 * 会直接抛。所以导出的是一个数组,让这个耦合是**结构性**的,而不是靠注释叮嘱。
 */
export const titleExtensions = [Title, DocWithTitle]

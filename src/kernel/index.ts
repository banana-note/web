/**
 * 内核的公开出口。
 *
 * 约定:`app/` 与 `extensions/` 只从这里 import,不深链到 `kernel/` 内部模块。
 * `extensions/` 那条由 `.oxlintrc.json` 的规则强制。
 *
 * 这里**不允许**出现任何 React 相关的东西(ADR-0002)。
 */
export { KERNEL_BUILTIN_EXTENSIONS } from './editor/builtins'
export { buildEditorOptions } from './editor/buildEditorOptions'
export type { BuildEditorOptionsInput } from './editor/buildEditorOptions'
export type { Note, NoteStore } from './storage/NoteStore'
